const HttpStatus = require('http-status-codes');
const quizService = require('../services/quiz');
const schemas = require('../config/jioschema');
const helper = require('../helpers/helper');

exports.getQuiz = async (req, res) => {
  const { reference_code } = req.params;

  if (reference_code == null) {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, '', 'reference_code is required');
  }

  const response = await quizService.getQuiz(reference_code);

  if (response.status === 'error') {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, response.data);
  }
  return helper.successHandler(res, response.data);
};

exports.getAllQuiz = async (req, res) => {
  const response = await quizService.getAllQuiz();

  if (response.status === 'error') {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, response.data);
  }
  return helper.successHandler(res, response.data);
};

exports.deleteQuiz = async (req, res) => {
  const { reference_code } = req.params;
  const response = await quizService.deleteQuiz(reference_code);

  if (response.status === 'error') {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, response.data);
  }
  return helper.successHandler(res, response.data);
};

exports.quizCreate = async (req, res) => {
  const { body } = req;
  const { error, value } = schemas.validateQuizCreation.validate(body);

  if (error != null) {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, value, 'invalid request');
  }

  const response = await quizService.quizCreate(value);

  if (response.status === 'error') {
    return helper.errorHandler(res, HttpStatus.BAD_REQUEST, response.data);
  }
  return helper.successHandler(res, response.data);
};
