'use strict';
const helper = require('../helpers/helper');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('QuizTypes', [
      { name: 'Challenge', active_status:helper.ActiveStatus.ACTIVE, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Random', active_status:helper.ActiveStatus.ACTIVE, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Group Competition', active_status:helper.ActiveStatus.ACTIVE, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('QuizTypes', null, {});
  }
};
