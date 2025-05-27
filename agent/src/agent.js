const axios = require('axios');
const os = require('os');
const { exec } = require('child_process');
const cronParser = require('cron-parser');

// Server URL
const SERVER_URL = 'http://localhost:3000';
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTc0ODMwNzI3MiwiZXhwIjoxNzQ4MzEwODcyfQ.EULhQmz0aJyMwcn87baXLbCGwkwtuptk8gFEU4eqy_s';

let AGENT_ID = null;
let failureCount = 0;

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
    const res = await axios.post(`${SERVER_URL}/agents`, {
      hostname,
      ip
    });
    AGENT_ID = res.data.id;
    console.log(`✅ Registered as agent #${AGENT_ID} (${hostname} @ ${ip})`);
  } catch (err) {
    console.error('❌ Agent registration failed:', err.message);
    process.exit(1);
  }
}

function getRetryInterval() {
  if (failureCount < 10) return 30 * 1000;
  if (failureCount < 20) return 60 * 1000;
  return 5 * 60 * 1000;
}

function isJobDue(schedule) {
  try {
    const interval = cronParser.parseExpression(schedule, {
      currentDate: new Date()
    });
    const next = interval.next().getTime();
    const now = Date.now();

    return (next - now) <= 30000;
  } catch (e) {
    console.error(`⛔ Invalid cron schedule: ${schedule}`);
    return false;
  }
}

async function updateJobStatus(jobId, data) {
  try {
    await axios.patch(`${SERVER_URL}/jobs/${jobId}`, data, {
      headers: { Authorization: TOKEN }
    });
  } catch (err) {
    console.error(`❌ Failed to update job #${jobId} status:`, err.response?.data || err.message);
  }
}

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

    for (const job of jobs) {
      console.log(`▶️ Running job #${job.id}: ${job.command}`);

      await updateJobStatus(job.id, {
        status: 'running'
      });

      exec(job.command, async (err, stdout, stderr) => {
        const timestamp = new Date().toISOString();
        if (err) {
          console.error(`❌ Job #${job.id} failed:`, err.message);
          await updateJobStatus(job.id, {
            status: 'failed',
            retryCount: job.retryCount + 1,
            lastError: err.message,
            lastRunAt: timestamp
          });
        } else {
          console.log(`✅ Job #${job.id} output:\n${stdout}`);
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
    console.error(`❌ Failed to fetch jobs (fail #${failureCount}):`, err.response?.data || err.message);
  }

  const nextInterval = getRetryInterval();
  console.log(`⏳ Next job check in ${nextInterval / 1000} seconds...\n`);
  setTimeout(fetchAndRunJobs, nextInterval);
}

// Bootstrap
(async () => {
  await registerAgent();
  fetchAndRunJobs();
})();
