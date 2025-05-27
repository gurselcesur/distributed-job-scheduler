// Import required dependencies
const { fetchJobs } = require('../services/apiService');
const { isJobDue } = require('../utils/cronUtils');
const { runJob } = require('./jobRunner');

// Track consecutive failures for error handling
let failureCount = 0;

// Define the interval between job checks (5000 milliseconds = 5 seconds)
const CHECK_INTERVAL_MS = 5000;

/**
 * Starts the job scheduler for a specific agent
 * @param {string} agentId - The unique identifier of the agent running the scheduler
 */
function startScheduler(agentId) {
  async function fetchAndRunJobs() {
    if (!agentId) return;

    try {
      const jobs = await fetchJobs();
      console.log(`Fetched ${jobs.length} jobs from API`);
      console.log(`Running as agent #${agentId}`);

      const dueJobs = jobs.filter(job => {
        const due = isJobDue(job.schedule);
        const recentRun =
          job.lastRunAt &&
          (Date.now() - new Date(job.lastRunAt).getTime()) <= CHECK_INTERVAL_MS + 500;

        console.log(
          `Job #${job.id} [agentId=${job.agentId}] - due=${due}, recentRun=${recentRun}`
        );

        return job.agentId === agentId && due && !recentRun;
      });

      failureCount = 0;

      for (const job of dueJobs) {
        console.log(`▶️ Executing job #${job.id}: ${job.command}`);
        runJob(job);
      }

    } catch (err) {
      failureCount++;
      console.error(`Failed to fetch jobs (fail #${failureCount}):`, err.response?.data || err.message);
    }

    console.log(`Next job check in ${CHECK_INTERVAL_MS / 1000} seconds...\n`);
    setTimeout(fetchAndRunJobs, CHECK_INTERVAL_MS);
  }

  fetchAndRunJobs();
}

module.exports = { startScheduler };