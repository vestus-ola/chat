module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      sender_id: {
        type: Sequelize.BIGINT
      },
      receiver_id: {
        type: Sequelize.BIGINT
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      message_status: {
        type: Sequelize.ENUM,
        values: ["delivered", "read"],
        defaultValue: "delivered"
      },
      delete_action: {
        type: Sequelize.ENUM,
        values: ["0", "1", "2", "3"],
        defaultValue: "0"
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
    return queryInterface.dropTable('Messages');
  }
};