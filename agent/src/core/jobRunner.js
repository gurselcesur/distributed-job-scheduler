const { exec } = require('child_process');
const { updateJobStatus } = require('../services/apiService');
const cronParser = require('cron-parser');

async function runJob(job) {
  console.log(`▶️ Running job #${job.id}: ${job.command}`);
  await updateJobStatus(job.id, { status: 'running' });

  const now = new Date();
  const timestamp = now.toISOString();

  // delay hesaplama
  let delayMs = null;
  try {
    const interval = cronParser.parseExpression(job.schedule, { currentDate: now });
    const expected = interval.prev().getTime();
    delayMs = Date.now() - expected;
  } catch (e) {
    console.error('⛔ Cannot compute delay for job', job.id, e.message);
  }

  exec(job.command, async (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Job #${job.id} failed:`, err.message);
      await updateJobStatus(job.id, {
        status: 'failed',
        retryCount: job.retryCount + 1,
        lastError: err.message,
        lastRunAt: timestamp,
        delayMs
      });
    } else {
      const status = delayMs > 3000 ? 'delayed' : 'success';
      console.log(`✅ Job #${job.id} output:\n${stdout}`);
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