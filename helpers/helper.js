"use script";
const HttpStatus = require('http-status-codes');

exports.errorHandler = (res, httpCode, data = {}, message = null) => {
    return res.status(httpCode).json({
        'status': 'error',
        'message': message ?? "operation unsuccessful",
        data
    });
}

exports.successHandler = (res, data = {}, message) => {
    return res.status(HttpStatus.OK).json({
        'status': 'success',
        'message': message ?? "operation successful",
        data
    });
}