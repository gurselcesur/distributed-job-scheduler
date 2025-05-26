const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Agent = require('./Agent')(sequelize, Sequelize.DataTypes);
db.Job = require('./Job')(sequelize, Sequelize.DataTypes);

// Relations
db.User.hasMany(db.Job, { foreignKey: 'userId' });
db.Job.belongsTo(db.User, { foreignKey: 'userId' });

db.Agent.hasMany(db.Job, { foreignKey: 'agentId' });
db.Job.belongsTo(db.Agent, { foreignKey: 'agentId' });


module.exports = db;