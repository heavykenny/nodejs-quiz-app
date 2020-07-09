const faker = require('faker');
const helper = require('../helpers/helper');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [];

    for (let i = 0; i < 10; i++) {
      const seedData = {
        reference_code: helper.generateRandom(6),
        question: `${faker.lorem.sentence()}?`,
        options: JSON.stringify([
          faker.lorem.word(),
          faker.lorem.word(),
          faker.lorem.word(),
          faker.lorem.word(),
        ]),
        answer: JSON.stringify([
          faker.lorem.word(),
        ]),
        type: 1,
        active_status: helper.ActiveStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      data.push(seedData);
    }

    return queryInterface.bulkInsert('Quizzes', data);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Quizzes', null, {});
  },
};
