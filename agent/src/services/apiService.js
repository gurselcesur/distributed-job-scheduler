const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTc0ODMxMDg4OSwiZXhwIjoxNzQ4MzE0NDg5fQ.U86b1xpNKk5C8AulQ2pgfPjEdR7PEVM1ayz5aQeOVHg'; // Token’ı istersen dışa alırız

async function fetchJobs() {
  const res = await axios.get(`${SERVER_URL}/jobs`, {
    headers: { Authorization: TOKEN }
  });
  return res.data;
}

async function updateJobStatus(jobId, data) {
  await axios.patch(`${SERVER_URL}/jobs/${jobId}`, data, {
    headers: { Authorization: TOKEN }
  });
}

module.exports = {
  fetchJobs,
  updateJobStatus
};