module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Agent', {
      hostname: DataTypes.STRING,
      ip: DataTypes.STRING,
      lastSeen: DataTypes.DATE
    });
  };