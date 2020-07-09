'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuizType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  QuizType.init({
    name: DataTypes.STRING,
    active_status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'QuizType',
  });
  return QuizType;
};