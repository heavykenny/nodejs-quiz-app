module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ActiveStatuses', [
      { name: 'Active', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Inactive', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pending', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Deleted', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Suspended', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Deactivated', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ActiveStatuses', null, {});
  },
};
