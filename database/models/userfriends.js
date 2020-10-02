module.exports = (sequelize, DataTypes) => {
  const UserFriends = sequelize.define('UserFriends', {
    user_id: DataTypes.BIGINT,
    friend_id: DataTypes.BIGINT,
    status: {
      type: DataTypes.ENUM,
      values: ["pending", "accepted", "decline", "blocked"],
      defaultValue: "pending"
    },
    user_read_status: {
      type: DataTypes.ENUM,
      values: ["unread", "read"],
      defaultValue: "unread"
    },
    friend_read_status: {
      type: DataTypes.ENUM,
      values: ["unread", "read"],
      defaultValue: "unread"
    }
  }, {});
  UserFriends.associate = function(models) {
    // associations can be defined here
    UserFriends.belongsTo(models.User, {
      foreignKey: "user_id"
    });
  };
  return UserFriends;
};