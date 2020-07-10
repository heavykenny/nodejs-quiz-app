'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quizprize extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Quizprize.init({
    quiz_challenge_id: DataTypes.INTEGER,
    price_details_id: DataTypes.INTEGER,
    claim_status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Quizprize',
  });
  return Quizprize;
};