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
    host_id: DataTypes.INTEGER,
    quiz_type: DataTypes.INTEGER,
    question_ids: DataTypes.INTEGER,
    quiz_price: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'QuizChallenge',
  });
  return QuizChallenge;
};