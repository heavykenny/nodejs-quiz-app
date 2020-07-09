module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Quizzes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reference_code: {
        type: Sequelize.STRING,
      },
      question: {
        type: Sequelize.STRING,
      },
      options: {
        type: Sequelize.JSON,
      },
      answer: {
        type: Sequelize.JSON,
      },
      type: {
        type: Sequelize.INTEGER,
      },
      active_status: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Quizzes');
  },
};
