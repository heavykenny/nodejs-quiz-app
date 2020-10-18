const db = require('../models/index');
const JWT = require('../config/jwt');
const helper = require('../helpers/helper');

exports.createUser = async (data) => {
  const { password } = data;
  kko
  const responses = helper.generateHash(password);
  const uuid = helper.generateUuid(20);

  try {
    const userCheck = await db.User.findOne({ where: { email: data.email } });
    if (userCheck) {
      return {
        status: 'error',
        data: {
          message: 'User this email already exits',
        },
      };
    }

    const user = await db.User.create({
      uuid,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone_number: data.phone_number,
      role: data.role,
      password: responses.hashString,
      salt: responses.stringSalt,
    });

    if (user) {
      return {
        status: 'success',
        data: {
          message: 'User successfully created',
        },
      };
    }
  } catch (err) {
    return {
      status: 'error',
      data: {
        message: err,
      },
    };
  }
};

exports.loginUser = async (data) => {
  try {
    const user = await db.User.findOne({ where: { email: data.email } });
    if (!user) {
      return {
        status: 'error',
        data: {
          message: 'User not found',
        },
      };
    }
    const responses = helper.generateHash(data.password, user.salt);

    if (user.password !== responses.hashString) {
      return {
        status: 'error',
        data: {
          message: 'Password entered is incorrect.',
        },
      };
    }

    // const body = {
    //   id: user.id,
    //   uuid: user.uuid,
    //   email: user.email,
    //   role: user.role,
    //   first_name: user.first_name,
    //   last_name: user.last_name,
    //   phone_number: user.phone_number,
      
    // };

    const body = {
      "iss": "https://api.mypatricia.co/login",
      "nbf": 1598570148,
      "jti": "2XnjCc2HobAR8Q3y",
      "sub": 75116,
      "prv": "b91279978f11aa7bc5670487fff01e228253fe48",
      "2fa_verified": true,
     };

    const token = JWT.generateAccessToken(body);
    return {
      status: 'success',
      data: {
        message: 'User successfully logged in.',
        token,
      },
    };
  } catch (err) {
    return {
      status: 'error',
      data: {
        message: err,
      },
    };
  }
};

exports.getUser = async (data) => {
  try {
    const user = await db.User.findOne({ where: { uuid: data } });
    if (!user) {
      return {
        status: 'error',
        data: {
          message: 'User not found',
        },
      };
    }
    const body = {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      active_status: user.active_status,
    };
    return {
      status: 'success',
      data: {
        message: 'User found.',
        user: body,
      },
    };
  } catch (err) {
    return {
      status: 'error',
      data: {
        message: err,
      },
    };
  }
};
