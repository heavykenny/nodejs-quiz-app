const HttpStatus = require('http-status-codes');
const challengeService = require('../services/challenge');
const schemas = require('../config/jioschema');
const helper = require('../helpers/helper');

exports.createChallenge = async (req, res) => {
  const { body } = req;
  const { error, value } = schemas.validateChallengeCreation.validate(body);

  if (error != null) {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, value, 'invalid request');
  }

  const response = await challengeService.challengeCreate(value);

  if (response.status === 'error') {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, response.data);
  }
  return helper.successHandler(res, response.data);
};