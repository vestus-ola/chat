module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserFriends', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      friend_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      status: {
        type: Sequelize.ENUM,
        values: ["pending", "accepted", "decline", "blocked"],
        defaultValue: "pending"
      },
      user_read_status: {
        type: Sequelize.ENUM,
        values: ["unread", "read"],
        defaultValue: "unread"
      },
      friend_read_status: {
        type: Sequelize.ENUM,
        values: ["unread", "read"],
        defaultValue: "unread"
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
    return queryInterface.dropTable('UserFriends');
  }
};