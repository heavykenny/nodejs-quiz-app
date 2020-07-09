const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ActiveStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  ActiveStatus.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ActiveStatus',
  });
  return ActiveStatus;
};
