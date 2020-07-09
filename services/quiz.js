const db = require('../models/index');
const helper = require('../helpers/helper');

exports.getAllQuiz = async () => {
  try {
    const quiz = await db.Quiz.findAll({ where: { active_status: helper.ActiveStatus.ACTIVE } });
    if (!quiz) {
      return {
        status: 'error',
        data: {
          message: 'Quiz not found.',
        },
      };
    }
    return {
      status: 'success',
      data: {
        message: 'Quiz found.',
        quiz,
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

exports.getQuiz = async (reference_code) => {
  try {
    const quiz = await db.Quiz.findOne({
      where: {
        reference_code,
        active_status: helper.ActiveStatus.ACTIVE,
      },
    });
    if (!quiz) {
      return {
        status: 'error',
        data: {
          message: 'Quiz not found.',
        },
      };
    }
    return {
      status: 'success',
      data: {
        message: 'Quiz found.',
        quiz,
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

exports.deleteQuiz = async (reference_code) => {
  try {
    const quiz = await db.Quiz.update({ active_status: helper.ActiveStatus.DELETED }, { where: { reference_code } });
    if (!quiz) {
      return {
        status: 'error',
        data: {
          message: 'Quiz not found.',
        },
      };
    }
    return {
      status: 'success',
      data: {
        message: 'Quiz successfully deleted.',
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

exports.quizCreate = async (data) => {
  try {
    const quiz = await db.Quiz.create({
      reference_code: helper.generateRandom(6),
      question: data.question,
      options: data.options,
      answer: data.answer,
      type: data.type,
      active_status: data.active_status ?? helper.ActiveStatus.ACTIVE,
    });
    return {
      status: 'success',
      data: {
        message: 'Quiz successfully created.',
        quiz,
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
