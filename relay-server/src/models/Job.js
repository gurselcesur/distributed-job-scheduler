module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    command: {
      type: DataTypes.STRING,
      allowNull: false
    },
    schedule: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING, // "success", "failed", "delayed", "running"
      defaultValue: "pending"
    },
    lastRunAt: {
      type: DataTypes.DATE
    },
    retryCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastError: {
      type: DataTypes.TEXT
    },
    delayMs: {
      type: DataTypes.INTEGER
    }
  });

  return Job;
};