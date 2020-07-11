'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuizChallenge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  QuizChallenge.init({
    question_ids: DataTypes.INTEGER,
    host_id: DataTypes.INTEGER,
    quiz_type: DataTypes.INTEGER,
    question_details: DataTypes.JSON,
    rules: DataTypes.JSON,
    active_status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'QuizChallenge',
  });
  return QuizChallenge;
};