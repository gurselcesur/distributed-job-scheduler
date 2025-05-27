// Agent script for a distributed job scheduler.
// Registers the agent, fetches due jobs, executes them, and updates their status on the server.

// Import required modules
const axios = require('axios');
const os = require('os');
const { exec } = require('child_process');
const cronParser = require('cron-parser');

// Server configuration
// Server URL
const SERVER_URL = 'http://localhost:3000';
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTc0ODMwNzI3MiwiZXhwIjoxNzQ4MzEwODcyfQ.EULhQmz0aJyMwcn87baXLbCGwkwtuptk8gFEU4eqy_s';

let AGENT_ID = null;
let failureCount = 0;

// Retrieves the first external IPv4 address of the machine
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

// Registers the agent with the central server using its hostname and IP
async function registerAgent() {
  const hostname = os.hostname();
  const ip = getIPAddress();

  try {
    const res = await axios.post(`${SERVER_URL}/agents`, {
      hostname,
      ip
    });
    AGENT_ID = res.data.id;
    console.log(`Registered as agent #${AGENT_ID} (${hostname} @ ${ip})`);
  } catch (err) {
    console.error('Agent registration failed:', err.message);
    process.exit(1);
  }
}

// Determines retry interval based on failure count
function getRetryInterval() {
  if (failureCount < 10) return 30 * 1000;
  if (failureCount < 20) return 60 * 1000;
  return 5 * 60 * 1000;
}

// Checks if a cron-scheduled job is due within the next 30 seconds
function isJobDue(schedule) {
  try {
    const interval = cronParser.parseExpression(schedule, {
      currentDate: new Date()
    });
    const next = interval.next().getTime();
    const now = Date.now();

    return (next - now) <= 30000;
  } catch (e) {
    console.error(`Invalid cron schedule: ${schedule}`);
    return false;
  }
}

// Sends a PATCH request to update the job status on the server
async function updateJobStatus(jobId, data) {
  try {
    await axios.patch(`${SERVER_URL}/jobs/${jobId}`, data, {
      headers: { Authorization: TOKEN }
    });
  } catch (err) {
    console.error(`Failed to update job #${jobId} status:`, err.response?.data || err.message);
  }
}

// Fetches jobs from the server assigned to this agent, executes due jobs, and updates their status
async function fetchAndRunJobs() {
  if (!AGENT_ID) return;

  try {
    const res = await axios.get(`${SERVER_URL}/jobs`, {
      headers: { Authorization: TOKEN }
    });

    const jobs = res.data.filter(job =>
      job.agentId === AGENT_ID && isJobDue(job.schedule)
    );
    failureCount = 0;

    // Iterate over due jobs and execute each
    for (const job of jobs) {
      console.log(`Running job #${job.id}: ${job.command}`);

      await updateJobStatus(job.id, {
        status: 'running'
      });

      // Execute the job's command and handle success/failure
      exec(job.command, async (err, stdout, stderr) => {
        const timestamp = new Date().toISOString();
        if (err) {
          console.error(`Job #${job.id} failed:`, err.message);
          await updateJobStatus(job.id, {
            status: 'failed',
            retryCount: job.retryCount + 1,
            lastError: err.message,
            lastRunAt: timestamp
          });
        } else {
          console.log(`Job #${job.id} output:\n${stdout}`);
          await updateJobStatus(job.id, {
            status: 'success',
            retryCount: 0,
            lastRunAt: timestamp
          });
        }
      });
    }

  } catch (err) {
    failureCount++;
    console.error(`Failed to fetch jobs (fail #${failureCount}):`, err.response?.data || err.message);
  }

  const nextInterval = getRetryInterval();
  console.log(`Next job check in ${nextInterval / 1000} seconds...\n`);
  setTimeout(fetchAndRunJobs, nextInterval);
}

// Entry point: register the agent and start job polling loop
(async () => {
  await registerAgent();
  fetchAndRunJobs();
})();
