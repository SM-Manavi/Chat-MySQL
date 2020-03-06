module.exports = function(sequelize, DataTypes) {
  return sequelize.define("user", {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};
