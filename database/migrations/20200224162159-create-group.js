module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      group_uuid: {
        type: Sequelize.STRING
      },
      group_name: {
        type: Sequelize.STRING
      },
      group_logo: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      group_logo_key: {
        type: Sequelize.TEXT,
        allowNull: true
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Groups');
  }
};