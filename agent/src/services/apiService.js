const axios = require('axios');
const { getToken } = require('../utils/tokenStore');

const SERVER_URL = 'http://localhost:3000';

async function fetchJobs() {
  const token = getToken();
  const res = await axios.get(`${SERVER_URL}/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

async function updateJobStatus(jobId, data) {
  const token = getToken();
  await axios.patch(`${SERVER_URL}/jobs/${jobId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

module.exports = {
  fetchJobs,
  updateJobStatus,
};