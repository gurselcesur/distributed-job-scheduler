const axios = require('axios');
const SERVER_URL = 'http://localhost:3000';

function startHeartbeat(agentId) {
  setInterval(async () => {
    try {
      await axios.post(`${SERVER_URL}/agents/heartbeat`, {
        agentId
      });
      console.log(`Heartbeat sent for agent #${agentId} \n`);
    } catch (err) {
      console.error('Heartbeat failed:', err.message);
    }
  }, 15000); // at 15 second pings here!
}

module.exports = { startHeartbeat };