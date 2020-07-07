const jwt = require('jsonwebtoken');
const helper = require('../helpers/helper');
const HttpStatus = require('http-status-codes');

exports.generateAccessToken = (body) => {
    return jwt.sign(body, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: '1800s'});
}
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return helper.errorHandler(res, HttpStatus.UNAUTHORIZED, {'message': 'unauthorized'});

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return helper.errorHandler(res, HttpStatus.FORBIDDEN, {'message': 'forbidden'})
        req.user = user
        req.secret_token = token
        next()
    })
}
