const _ = require('dotenv').config();
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const v1Router = require('./routes/api/v1/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// V1 Routs
app.use('/api/v1', v1Router);

io.on('connection', (socket) => {
  // User Connected

  socket.on('answer_sent', (msg) => {
    // Next Question.
    // Some other logic.

    // Emit after the time.
    io.emit('next_question', msg);
  });

  socket.on('disconnect', () => {
    // Bad Connection or Disconnected.
  });
});

const PORT = process.env.PORT || 4000;

let server = '';
server = http.listen(PORT, () => {});
