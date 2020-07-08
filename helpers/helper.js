'use script';

const HttpStatus = require('http-status-codes');

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
