const helper = require('../helpers/helper');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM('host', 'player', 'admin'),
      },
      salt: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      active_status: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: helper.ActiveStatus.ACTIVE,
        references: { model: 'ActiveStatuses', key: 'id' }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};
