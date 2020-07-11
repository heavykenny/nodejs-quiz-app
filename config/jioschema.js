const Joi = require('@hapi/joi');

exports.validateUserCreation = Joi.object({
  first_name: Joi.string().alphanum().min(3).max(30).required(),
  last_name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string(),
  role: Joi.string().valid('host', 'player', 'admin').required(),
  password: Joi.string().min(6).required(),
});

exports.validateUserLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.validateQuestionCreation = Joi.object({
  question: Joi.string().required(),
  options: Joi.array().required(),
  answer: Joi.array().required(),
  type: Joi.number().required(),
  active_status: Joi.number(),
});

exports.validateQuestionUpdate = Joi.object({
  question: Joi.string().required(),
  options: Joi.array().required(),
  answer: Joi.array().required(),
  type: Joi.number().required(),
  active_status: Joi.number(),
});

exports.validateChallengeCreation = Joi.object({
  host_id: Joi.number(),
  quiz_type: Joi.number().required(),
  question_details: Joi.array().required(),
  rules: Joi.array().required(),
  active_status: Joi.number(),
});
