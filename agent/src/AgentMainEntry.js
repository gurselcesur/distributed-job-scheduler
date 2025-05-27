const readline = require('readline');
const axios = require('axios');
const { setToken } = require('./utils/tokenStore');
const { registerAgent } = require('./services/agentService');
const { startScheduler } = require('./core/jobScheduler');
const { startHeartbeat } = require('./services/heartbeatService');

const SERVER_URL = 'http://localhost:3000';

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function login() {
  const username = await ask("Username: ");
  const password = await ask("Password: ");

  try {
    const res = await axios.post(`${SERVER_URL}/login`, { username, password });
    setToken(res.data.token); // Store token for future requests
    console.log("Login successful.\n");
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    process.exit(1);
  }
}

(async () => {
  await login();

  const agentId = await registerAgent();
  startHeartbeat(agentId);
  startScheduler(agentId);

  rl.close(); // Close CLI after login and setup
})();