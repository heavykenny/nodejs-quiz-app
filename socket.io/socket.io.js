/* eslint-disable consistent-return */
/* eslint-disable */
/**
 * Module dependencies.
 */

const Emitter = require('events').EventEmitter;
const parser = require('socket.io-parser');
const hasBin = require('has-binary2');
const url = require('url');
const debug = require('debug')('socket.io:socket');

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Blacklisted events.
 *
 * @api public
 */

exports.events = [
  'error',
  'connect',
  'disconnect',
  'disconnecting',
  'newListener',
  'removeListener',
];

/**
 * Flags.
 *
 * @api private
 */

const flags = [
  'json',
  'volatile',
  'broadcast',
  'local',
];

/**
 * `EventEmitter#emit` reference.
 */

const { emit } = Emitter.prototype;

/**
 * Interface to a `Client` for a given `Namespace`.
 *
 * @param {Namespace} nsp
 * @param {Client} client
 * @api public
 */

function Socket(nsp, client, query) {
  this.nsp = nsp;
  this.server = nsp.server;
  this.adapter = this.nsp.adapter;
  this.id = nsp.name !== '/' ? `${nsp.name}#${client.id}` : client.id;
  this.client = client;
  this.conn = client.conn;
  this.rooms = {};
  this.acks = {};
  this.connected = true;
  this.disconnected = false;
  this.handshake = this.buildHandshake(query);
  this.fns = [];
  this.flags = {};
  this._rooms = [];
}

/**
 * Inherits from `EventEmitter`.
 */

Socket.prototype.__proto__ = Emitter.prototype;

/**
 * Apply flags from `Socket`.
 */

flags.forEach((flag) => {
  Object.defineProperty(Socket.prototype, flag, {
    get() {
      this.flags[flag] = true;
      return this;
    },
  });
});

/**
 * `request` engine.io shortcut.
 *
 * @api public
 */

Object.defineProperty(Socket.prototype, 'request', {
  get() {
    return this.conn.request;
  },
});

/**
 * Builds the `handshake` BC object
 *
 * @api private
 */

Socket.prototype.buildHandshake = function (query) {
  const self = this;
  function buildQuery() {
    const requestQuery = url.parse(self.request.url, true).query;
    // if socket-specific query exist, replace query strings in requestQuery
    return { ...query, ...requestQuery };
  }
  return {
    headers: this.request.headers,
    time: `${new Date()}`,
    address: this.conn.remoteAddress,
    xdomain: !!this.request.headers.origin,
    secure: !!this.request.connection.encrypted,
    issued: +(new Date()),
    url: this.request.url,
    query: buildQuery(),
  };
};

/**
 * Emits to this client.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = (ev) => {
  if (~exports.events.indexOf(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  const args = Array.prototype.slice.call(arguments);
  const packet = {
    type: (this.flags.binary !== undefined ? this.flags.binary : hasBin(args)) ? parser.BINARY_EVENT : parser.EVENT,
    data: args,
  };

  // access last argument to see if it's an ACK callback
  if (typeof args[args.length - 1] === 'function') {
    if (this._rooms.length || this.flags.broadcast) {
      throw new Error('Callbacks are not supported when broadcasting');
    }

    debug('emitting packet with ack id %d', this.nsp.ids);
    this.acks[this.nsp.ids] = args.pop();
    packet.id = this.nsp.ids++;
  }

  const rooms = this._rooms.slice(0);
  const flags = { ...this.flags };

  // reset flags
  this._rooms = [];
  this.flags = {};

  if (rooms.length || flags.broadcast) {
    this.adapter.broadcast(packet, {
      except: [this.id],
      rooms,
      flags,
    });
  } else {
    // dispatch packet
    this.packet(packet, flags);
  }
  return this;
};

/**
 * Targets a room when broadcasting.
 *
 * @param {String} name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.to = Socket.prototype.in = (name) => {
  if (!~this._rooms.indexOf(name)) this._rooms.push(name);
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = Socket.prototype.write = () => {
  const args = Array.prototype.slice.call(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Writes a packet.
 *
 * @param {Object} packet object
 * @param {Object} opts options
 * @api private
 */

Socket.prototype.packet = (packet, opts) => {
  packet.nsp = this.nsp.name;
  opts = opts || {};
  opts.compress = opts.compress !== false;
  this.client.packet(packet, opts);
};

/**
 * Joins a room.
 *
 * @param {String|Array} room or array of rooms
 * @param {Function} fn optional, callback
 * @return {Socket} self
 * @api private
 */

Socket.prototype.join = (rooms, fn) => {
  debug('joining room %s', rooms);
  const self = this;
  if (!Array.isArray(rooms)) {
    rooms = [rooms];
  }
  rooms = rooms.filter((room) => !self.rooms.hasOwnProperty(room));
  if (!rooms.length) {
    fn && fn(null);
    return this;
  }
  this.adapter.addAll(this.id, rooms, (err) => {
    if (err) return fn && fn(err);
    debug('joined room %s', rooms);
    rooms.forEach((room) => {
      self.rooms[room] = room;
    });
    fn && fn(null);
  });
  return this;
};

/**
 * Leaves a room.
 *
 * @param {String} room
 * @param {Function} fn optional, callback
 * @return {Socket} self
 * @api private
 */

Socket.prototype.leave = (rooms, fn) => {
  debug('leave room %s', room);
  const self = this;
  this.adapter.del(this.id, room, (err) => {
    if (err) return fn && fn(err);
    debug('left room %s', room);
    delete self.rooms[room];
    fn && fn(null);
  });
  return this;
};

/**
 * Leave all rooms.
 *
 * @api private
 */

Socket.prototype.leaveAll = () => {
  this.adapter.delAll(this.id);
  this.rooms = {};
};

/**
 * Called by `Namespace` upon successful
 * middleware execution (ie: authorization).
 * Socket is added to namespace array before
 * call to join, so adapters can access it.
 *
 * @api private
 */

Socket.prototype.onconnect = () => {
  debug('socket connected - writing packet');
  this.nsp.connected[this.id] = this;
  this.join(this.id);
  const skip = this.nsp.name === '/' && this.nsp.fns.length === 0;
  if (skip) {
    debug('packet already sent in initial handshake');
  } else {
    this.packet({ type: parser.CONNECT });
  }
};

/**
 * Called with each packet. Called by `Client`.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = (packet) => {
  debug('got packet %j', packet);
  switch (packet.type) {
    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
    default:
      this.onerror(new Error(packet.data));
      break;
  }
};

/**
 * Called upon event packet.
 *
 * @param {Object} packet object
 * @api private
 */

Socket.prototype.onevent = (packet) => {
  const args = packet.data || [];
  debug('emitting event %j', args);

  if (packet.id != null) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  this.dispatch(args);
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @param {Number} id packet id
 * @api private
 */

Socket.prototype.ack = (id) => {
  const self = this;
  let sent = false;
  return () => {
    // prevent double callbacks
    if (sent) return;
    const args = Array.prototype.slice.call(arguments);
    debug('sending ack %j', args);

    self.packet({
      id,
      type: hasBin(args) ? parser.BINARY_ACK : parser.ACK,
      data: args,
    });

    sent = true;
  };
};

/**
 * Called upon ack packet.
 *
 * @api private
 */

Socket.prototype.onack = (packet) => {
  const ack = this.acks[packet.id];
  if (typeof ack === 'function') {
    debug('calling ack %s with %j', packet.id, packet.data);
    ack.apply(this, packet.data);
    delete this.acks[packet.id];
  } else {
    debug('bad ack %s', packet.id);
  }
};

/**
 * Called upon client disconnect packet.
 *
 * @api private
 */

Socket.prototype.ondisconnect = () => {
  debug('got disconnect packet');
  this.onclose('client namespace disconnect');
};

/**
 * Handles a client error.
 *
 * @api private
 */

Socket.prototype.onerror = (err) => {
  if (this.listeners('error').length) {
    this.emit('error', err);
  } else {
    console.error('Missing error handler on `socket`.');
    console.error(err.stack);
  }
};

/**
 * Called upon closing. Called by `Client`.
 *
 * @param {String} reason
 * @throw {Error} optional error object
 * @api private
 */

Socket.prototype.onclose = (reason) => {
  if (!this.connected) return this;
  debug('closing socket - reason %s', reason);
  this.emit('disconnecting', reason);
  this.leaveAll();
  this.nsp.remove(this);
  this.client.remove(this);
  this.connected = false;
  this.disconnected = true;
  delete this.nsp.connected[this.id];
  this.emit('disconnect', reason);
};

/**
 * Produces an `error` packet.
 *
 * @param {Object} err error object
 * @api private
 */

Socket.prototype.error = (err) => {
  this.packet({ type: parser.ERROR, data: err });
};

/**
 * Disconnects this client.
 *
 * @param {Boolean} close if `true`, closes the underlying connection
 * @return {Socket} self
 * @api public
 */

Socket.prototype.disconnect = (close) => {
  if (!this.connected) return this;
  if (close) {
    this.client.disconnect();
  } else {
    this.packet({ type: parser.DISCONNECT });
    this.onclose('server namespace disconnect');
  }
  return this;
};

/**
 * Sets the compress flag.
 *
 * @param {Boolean} compress if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */

Socket.prototype.compress = (compress) => {
  this.flags.compress = compress;
  return this;
};

/**
 * Sets the binary flag
 *
 * @param {Boolean} Encode as if it has binary data if `true`, Encode as if it doesnt have binary data if `false`
 * @return {Socket} self
 * @api public
 */

Socket.prototype.binary = (binary) => {
  this.flags.binary = binary;
  return this;
};

/**
 * Dispatch incoming event to socket listeners.
 *
 * @param {Array} event that will get emitted
 * @api private
 */

Socket.prototype.dispatch = (event) => {
  debug('dispatching an event %j', event);
  const self = this;
  function dispatchSocket(err) {
    process.nextTick(() => {
      if (err) {
        return self.error(err.data || err.message);
      }
      emit.apply(self, event);
    });
  }
  this.run(event, dispatchSocket);
};

/**
 * Sets up socket middleware.
 *
 * @param {Function} middleware function (event, next)
 * @return {Socket} self
 * @api public
 */

Socket.prototype.use = (fn) => {
  this.fns.push(fn);
  return this;
};

/**
 * Executes the middleware for an incoming event.
 *
 * @param {Array} event that will get emitted
 * @param {Function} last fn call in the middleware
 * @api private
 */
Socket.prototype.run = (event, fn) => {
  const fns = this.fns.slice(0);
  if (!fns.length) return fn(null);

  function run(i) {
    fns[i](event, (err) => {
      // upon error, short-circuit
      if (err) return fn(err);

      // if no middleware left, summon callback
      if (!fns[i + 1]) return fn(null);

      // go on to next
      run(i + 1);
    });
  }

  run(0);
};
