'use script';

const HttpStatus = require('http-status-codes');
const crypto = require('crypto');

exports.errorHandler = (res, httpCode, data = {}, message = null) => res.status(httpCode).json({
  status: 'error',
  message: message ?? 'operation unsuccessful',
  data,
});

exports.successHandler = (res, data = {}, message) => res.status(HttpStatus.OK).json({
  status: 'success',
  message: message ?? 'operation successful',
  data,
});

exports.generateHash = (string, salt = null) => {
  const stringSalt = salt ?? crypto.randomBytes(64).toString('hex');
  const hashString = crypto.pbkdf2Sync(string, stringSalt, 10000, 64, 'sha512').toString('base64');
  return {
    hashString, stringSalt,
  };
};

exports.generateUuid = () => crypto.randomBytes(64).toString('hex');

exports.generateRandom = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.ActiveStatus = {
  ACTIVE: 1,
  INACTIVE: 2,
  PENDING: 3,
  DELETED: 4,
  SUSPENDED: 5,
  DEACTIVATED: 6,
};
