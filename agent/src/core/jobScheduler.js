const { fetchJobs } = require('../services/apiService');
const { isJobDue } = require('../utils/cronUtils');
const { runJob } = require('./jobRunner');

let failureCount = 0;

// Daha sık kontrol edeceğimiz için interval düşürülüyor
const CHECK_INTERVAL_MS = 5000;

function startScheduler(agentId) {
  async function fetchAndRunJobs() {
    if (!agentId) return;

    try {
      const jobs = await fetchJobs();

      const dueJobs = jobs.filter(job =>
        job.agentId === agentId &&
        isJobDue(job.schedule) &&
        (!job.lastRunAt || (Date.now() - new Date(job.lastRunAt).getTime()) > CHECK_INTERVAL_MS + 500)
      );

      failureCount = 0;

      for (const job of dueJobs) {
        runJob(job);
      }

    } catch (err) {
      failureCount++;
      console.error(`❌ Failed to fetch jobs (fail #${failureCount}):`, err.response?.data || err.message);
    }

    console.log(`⏳ Next job check in ${CHECK_INTERVAL_MS / 1000} seconds...\n`);
    setTimeout(fetchAndRunJobs, CHECK_INTERVAL_MS);
  }

  fetchAndRunJobs();
}

module.exports = { startScheduler };