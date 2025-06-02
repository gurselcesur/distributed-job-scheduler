// This module handles agent registration and IP detection for the distributed job scheduler.

// Import the built-in 'os' module to access system-related information
const os = require('os');
// Import axios for making HTTP requests
const axios = require('axios');

// URL of the central server where agents register themselves
const SERVER_URL = 'https://***********.ngrok-free.app';

// Retrieves the first non-internal IPv4 address of the machine
function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const i of iface) {
      // Skip internal interfaces and look for external IPv4 address
      if (i.family === 'IPv4' && !i.internal) {
        return i.address;
      }
    }
  }
  return '127.0.0.1';
}

// Registers the agent with the central server or reuses existing one
async function registerAgent() {
  const hostname = os.hostname();
  const ip = getIPAddress();

  try {
    // Try to find an existing agent with the same hostname and IP
    const res = await axios.get(`${SERVER_URL}/agents`);
    const existing = res.data.find(agent => agent.hostname === hostname && agent.ip === ip);

    if (existing) {
      console.log(`Reusing existing agent #${existing.id} (${hostname} @ ${ip})`);
      return existing.id;
    }

    // If not found, register a new agent
    const createRes = await axios.post(`${SERVER_URL}/agents`, { hostname, ip });
    console.log(`Registered as new agent #${createRes.data.id} (${hostname} @ ${ip})`);
    return createRes.data.id;
  } catch (err) {
    console.error('Agent registration failed:', err.message);
    process.exit(1);
  }
}

// Export the functions for use in other parts of the application
module.exports = { getIPAddress, registerAgent };