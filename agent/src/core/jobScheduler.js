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
  /**
   * Fetches and executes due jobs for this agent
   * This function runs recursively with a timeout
   */
  async function fetchAndRunJobs() {
    // Exit if no agent ID is provided
    if (!agentId) return;

    try {
      // Fetch all jobs from the API
      const jobs = await fetchJobs();

      // Filter jobs that:
      // 1. Are assigned to this agent
      // 2. Are due to run based on their schedule
      // 3. Haven't run recently (to prevent duplicate executions)
      const dueJobs = jobs.filter(job =>
        job.agentId === agentId &&
        isJobDue(job.schedule) &&
        (!job.lastRunAt || (Date.now() - new Date(job.lastRunAt).getTime()) > CHECK_INTERVAL_MS + 500)
      );

      // Reset failure count on successful fetch
      failureCount = 0;

      // Execute each due job
      for (const job of dueJobs) {
        runJob(job);
      }

    } catch (err) {
      // Increment failure count and log error
      failureCount++;
      console.error(`Failed to fetch jobs (fail #${failureCount}):`, err.response?.data || err.message);
    }

    // Schedule the next check
    console.log(`Next job check in ${CHECK_INTERVAL_MS / 1000} seconds...\n`);
    setTimeout(fetchAndRunJobs, CHECK_INTERVAL_MS);
  }

  // Start the initial job check
  fetchAndRunJobs();
}

module.exports = { startScheduler };