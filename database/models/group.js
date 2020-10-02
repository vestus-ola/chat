module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    group_name: DataTypes.STRING,
    group_uuid: DataTypes.STRING,
    group_logo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    group_logo_key: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {});
  Group.associate = function(models) {
    // associations can be defined here
    Group.belongsToMany(models.User, {
      through: models.GroupUser,
      foreignKey: 'group_id',
      onDelete: "CASCADE"
    });
  };
  return Group;
};