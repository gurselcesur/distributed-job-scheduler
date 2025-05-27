// This module handles agent registration and IP detection for the distributed job scheduler.

// Import the built-in 'os' module to access system-related information
const os = require('os');
// Import axios for making HTTP requests
const axios = require('axios');

// URL of the central server where agents register themselves
const SERVER_URL = 'http://localhost:3000';

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

// Registers the agent with the central server and logs the assigned agent ID
async function registerAgent() {
  const hostname = os.hostname();
  const ip = getIPAddress();

  try {
    // Send a POST request to the server with hostname and IP address
    const res = await axios.post(`${SERVER_URL}/agents`, { hostname, ip });
    console.log(`Registered as agent #${res.data.id} (${hostname} @ ${ip})`);
    return res.data.id;
  } catch (err) {
    console.error('Agent registration failed:', err.message);
    // Exit the process if registration fails
    process.exit(1);
  }
}

// Export the functions for use in other parts of the application
module.exports = { getIPAddress, registerAgent };