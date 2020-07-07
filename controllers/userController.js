'use strict';
const UserService = require('../services/user');
const schemas = require('../config/jioschema');
const helper = require('../helpers/helper');
const HttpStatus = require('http-status-codes');

exports.userCreate = async (req, res) => {
    const {body} = req;
    const {error, value} = schemas.validateUserCreation.validate(body);
    if (error != null) {
        return helper.errorHandler(res, HttpStatus.BAD_REQUEST, value, 'invalid request');
    }
    const response = await UserService.createUser(value);
    if (response.status === 'error') {
        return helper.errorHandler(res, HttpStatus.BAD_REQUEST, response.data)
    }
    return helper.successHandler(res, response.data);
};

exports.userLogin = async (req, res) => {
    const {body} = req;
    const {error, value} = schemas.validateUserLogin.validate(body);
    if (error != null) {
        return helper.errorHandler(res, HttpStatus.BAD_REQUEST, value, 'invalid request');
    }
    const response = await UserService.loginUser(value);
    if (response.status === 'error') {
        return helper.errorHandler(res, HttpStatus.BAD_REQUEST, response.data)
    }
    return helper.successHandler(res, response.data);
}

exports.index = async (req, res) => {
    const data = {
        user: req.user,
        token : req.secret_token
    }
    return helper.successHandler(res, data);
};