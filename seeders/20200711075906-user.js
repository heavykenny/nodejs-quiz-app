'use strict';
const helper = require('../helpers/helper');
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const responses = helper.generateHash('password');
    const createUser = [{
      uuid: helper.generateUuid(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      phone_number: faker.phone.phoneNumber(),
      role: 'admin',
      password: responses.hashString,
      salt: responses.stringSalt,
      createdAt: new Date(),
      updatedAt: new Date()
    }];
    await queryInterface.bulkInsert('Users', createUser);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
