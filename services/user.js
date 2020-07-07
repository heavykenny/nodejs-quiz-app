'use strict';
const db = require('../models/index');
const crypto = require('crypto');
const JWT = require('../config/jwt');

exports.createUser = async (data) => {
    let password = data.password;
    let salt = crypto.randomBytes(64).toString('hex');
    let hash_password = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

    try {
        const userCheck = await db.User.findOne({where: {email: data.email}});
        if (userCheck) {
            return {
                'status': 'error',
                'data': {
                    'message': 'User this email already exits'
                }
            };
        }

        const user = await db.User.create({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone_number: data.phone_number,
            role: data.role,
            password: hash_password,
            salt: salt
        });

        if (user) {
            return {
                'status': 'success',
                'data': {
                    'message': 'User successfully created'
                }
            };
        }
    } catch (err) {
        return {
            'status': 'error',
            'data': {
                'message': err
            }
        };
    }
}

exports.loginUser = async (data) => {
    try {
        const user = await db.User.findOne({where: {email: data.email}});
        if (!user) {
            return {
                'status': 'error',
                'data': {
                    'message': 'User not found'
                }
            };
        }
        const hash_password = crypto.pbkdf2Sync(data.password, user.salt, 10000, 64, `sha512`).toString(`base64`);

        if (user.password !== hash_password) {
            return {
                'status': 'error',
                'data': {
                    'salt': user.salt,
                    'hash': hash_password,
                    'message': 'Password entered is incorrect.'
                }
            };
        }

        const body = {
            id: user.id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number,
        }

        const token = JWT.generateAccessToken(body);
        return {
            'status': 'success',
            'data': {
                'message': 'User successfully logged in.',
                token
            }
        };

    } catch (err) {
        return {
            'status': 'error',
            'data': {
                'message': err
            }
        };
    }
}



