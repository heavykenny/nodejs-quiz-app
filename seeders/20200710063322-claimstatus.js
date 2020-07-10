'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Claimstatuses', [
      { name: 'Unclaimed', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Claimed', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Deactivated', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Blocked', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Claimstatuses', null, {});
  }
};
