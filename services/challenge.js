const db = require('../models/index');
const helper = require('../helpers/helper');

exports.challengeCreate = async (data) => {
  try {
    const question = await db.QuizChallenge.create({
      host_id: data.host_id ?? data.user.id,
      quiz_type: data.quiz_type,
      question_details: data.question_details,
      rules: data.rules,
      quiz_price: data.quiz_price,
      active_status: data.active_status ?? helper.ActiveStatus.ACTIVE,
    });
    return {
      status: 'success',
      data: {
        message: 'Question successfully created.',
        question,
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