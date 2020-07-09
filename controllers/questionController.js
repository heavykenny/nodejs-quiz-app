const HttpStatus = require('http-status-codes');
const questionService = require('../services/question');
const schemas = require('../config/jioschema');
const helper = require('../helpers/helper');

exports.getQuestion = async (req, res) => {
  const { referenceCode } = req.params;

  if (referenceCode == null) {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, '', 'reference_code is required');
  }

  const response = await questionService.getQuestion(referenceCode);

  if (response.status === 'error') {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, response.data);
  }
  return helper.successHandler(res, response.data);
};

exports.getAllQuestion = async (req, res) => {
  const response = await questionService.getAllQuestion();

  if (response.status === 'error') {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, response.data);
  }
  return helper.successHandler(res, response.data);
};

exports.deleteQuestion = async (req, res) => {
  const { referenceCode } = req.params;
  const response = await questionService.deleteQuestion(referenceCode);

  if (response.status === 'error') {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, response.data);
  }
  return helper.successHandler(res, response.data);
};

exports.questionCreate = async (req, res) => {
  const { body } = req;
  const { error, value } = schemas.validateQuestionCreation.validate(body);

  if (error != null) {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, value, 'invalid request');
  }

  const response = await questionService.questionCreate(value);

  if (response.status === 'error') {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, response.data);
  }
  return helper.successHandler(res, response.data);
};

exports.questionUpdate = async (req, res) => {
  const { body, params } = req;
  const { referenceCode } = params;

  const { error, value } = schemas.validateQuestionUpdate.validate(body);

  if (error != null) {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, value, 'invalid request');
  }

  const response = await questionService.questionUpdate(referenceCode, value);

  if (response.status === 'error') {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, response.data);
  }
  return helper.successHandler(res, response.data);
};
