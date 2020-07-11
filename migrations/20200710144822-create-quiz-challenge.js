'use strict';
const helper = require('../helpers/helper');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('QuizChallenges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      host_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' }
      },
      quiz_type: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'QuizTypes', key: 'id' }
      },
      question_details: {
        allowNull: false,
        type: Sequelize.JSON
      },
      rules: {
        allowNull: false,
        type: Sequelize.JSON
      },
      active_status: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: helper.ActiveStatus.ACTIVE,
        references: { model: 'ActiveStatuses', key: 'id' }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('QuizChallenges');
  }
};