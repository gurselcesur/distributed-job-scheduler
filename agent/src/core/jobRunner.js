// Import required dependencies
const { exec } = require('child_process');
const { updateJobStatus } = require('../services/apiService');
const cronParser = require('cron-parser');

/**
 * Executes a scheduled job and updates its status
 * @param {Object} job - The job object containing execution details
 * @param {string} job.id - Unique identifier for the job
 * @param {string} job.command - Command to be executed
 * @param {string} job.schedule - Cron schedule expression
 * @param {number} job.retryCount - Number of retry attempts
 */
async function runJob(job) {
  console.log(`Running job #${job.id}: ${job.command}`);
  await updateJobStatus(job.id, { status: 'running' });

  // Record the current timestamp for job execution
  const now = new Date();
  const timestamp = now.toISOString();

  // Calculate execution delay by comparing with expected schedule
  let delayMs = null;
  try {
    const interval = cronParser.parseExpression(job.schedule, { currentDate: now });
    const expected = interval.prev().getTime();
    delayMs = Date.now() - expected;
  } catch (e) {
    console.error('Cannot compute delay for job', job.id, e.message);
  }

  // Execute the job command and handle the result
  exec(job.command, async (err, stdout, stderr) => {
    if (err) {
      // Handle job execution failure
      console.error(`Job #${job.id} failed:`, err.message);
      await updateJobStatus(job.id, {
        status: 'failed',
        retryCount: job.retryCount + 1,
        lastError: err.message,
        lastRunAt: timestamp,
        delayMs
      });
    } else {
      // Handle successful job execution
      // Mark as delayed if execution was more than 3 seconds late
      const status = delayMs > 3000 ? 'delayed' : 'success';
      console.log(`Job #${job.id} output:\n${stdout}`);
      await updateJobStatus(job.id, {
        status,
        retryCount: 0,
        lastRunAt: timestamp,
        delayMs
      });
    }
  });
}

module.exports = { runJob };