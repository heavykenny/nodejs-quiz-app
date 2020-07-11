const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const helper = require('../helpers/helper');

exports.generateAccessToken = (body) => jwt.sign(body, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '7200s' });
// eslint-disable-next-line consistent-return
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return helper.errorHandler(res, HttpStatus.UNAUTHORIZED, { message: 'unauthorized' });

  // eslint-disable-next-line consistent-return
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return helper.errorHandler(res, HttpStatus.FORBIDDEN, { message: 'forbidden' });
    req.user = user;
    req.secret_token = token;
    next();
  });
};
