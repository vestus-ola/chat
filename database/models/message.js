module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    sender_id: DataTypes.BIGINT,
    receiver_id: DataTypes.BIGINT,
    message: DataTypes.TEXT,
    message_status: {
      type: DataTypes.ENUM,
      values: ["delivered", "read"],
      defaultValue: "delivered"
    },
    delete_action: {
      type: DataTypes.ENUM,
      values: ["0", "1", "2", "3"],
      defaultValue: "0"
    }
  }, {});
  Message.associate = function (models) {
    // associations can be defined here
    Message.belongsTo(models.User, {
      foreignKey: "receiver_id",
      target: "id"
    });

    Message.belongsTo(models.User, {
      foreignKey: "sender_id",
      target: "id"
    });
  };
  return Message;
};