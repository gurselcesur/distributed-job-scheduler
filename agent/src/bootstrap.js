const { registerAgent } = require('./services/agentService');
const { startScheduler } = require('./core/jobScheduler');
const { startHeartbeat } = require('./services/heartbeatService');

(async () => {
  const agentId = await registerAgent();
  startHeartbeat(agentId);
  startScheduler(agentId);
})();