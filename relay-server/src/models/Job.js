module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('Job', {
      command: {
        type: DataTypes.STRING,
        allowNull: false
      },
      schedule: {
        type: DataTypes.STRING, // e.g., "*/5 * * * *"
        allowNull: false
      }
    });
  
    return Job;
  };