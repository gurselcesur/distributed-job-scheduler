const os = require('os');
const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';

function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const i of iface) {
      if (i.family === 'IPv4' && !i.internal) {
        return i.address;
      }
    }
  }
  return '127.0.0.1';
}

async function registerAgent() {
  const hostname = os.hostname();
  const ip = getIPAddress();

  try {
    const res = await axios.post(`${SERVER_URL}/agents`, { hostname, ip });
    console.log(`✅ Registered as agent #${res.data.id} (${hostname} @ ${ip})`);
    return res.data.id;
  } catch (err) {
    console.error('❌ Agent registration failed:', err.message);
    process.exit(1);
  }
}

module.exports = { getIPAddress, registerAgent };