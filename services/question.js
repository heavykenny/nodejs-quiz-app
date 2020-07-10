const db = require('../models/index');
const helper = require('../helpers/helper');

exports.getAllQuestion = async () => {
  try {
    const question = await db.Question.findAll({ where: { active_status: helper.ActiveStatus.ACTIVE } });
    if (!question) {
      return {
        status: 'error',
        data: {
          message: 'Question not found.',
        },
      };
    }
    return {
      status: 'success',
      data: {
        message: 'Questions found.',
        questions: question,
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

exports.getQuestion = async (referenceCode) => {
  try {
    const question = await db.Question.findOne({
      where: { reference_code:referenceCode, active_status: helper.ActiveStatus.ACTIVE },
    });
    if (!question) {
      return {
        status: 'error',
        data: {
          message: 'Question not found.',
        },
      };
    }
    return {
      status: 'success',
      data: {
        message: 'Question found.',
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

exports.deleteQuestion = async (referenceCode) => {
  try {
    const question = await db.Question.update({ active_status: helper.ActiveStatus.DELETED },
      { where: { reference_code:referenceCode } });
    if (!question) {
      return {
        status: 'error',
        data: {
          message: 'Question not found.',
        },
      };
    }
    return {
      status: 'success',
      data: {
        message: 'Question successfully deleted.',
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

exports.questionCreate = async (data) => {
  try {
    const question = await db.Question.create({
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

exports.questionUpdate = async (referenceCode, data) => {
  try {
    const getQuestion = await db.Question.findOne({ where: { reference_code:referenceCode } });

    if (!getQuestion) {
      return {
        status: 'error',
        data: {
          message: 'Question not found',
        },
      };
    }

    const question = await db.Question.update({
      question: data.question,
      options: data.options,
      answer: data.answer,
      type: data.type,
      active_status: data.active_status,
    }, { where: { reference_code:referenceCode } });

    if (!question) {
      return {
        status: 'error',
        data: {
          message: 'Error when updating Question.',
        },
      };
    }

    const returnData = await getQuestion.reload();
    return {
      status: 'success',
      data: {
        message: 'Question successfully updated.',
        data: returnData,
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
