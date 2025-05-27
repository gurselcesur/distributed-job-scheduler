const cronParser = require('cron-parser');

/**
 * Check if a job is due to run within the last 30 seconds.
 * Uses cron schedule and compares with previous execution time.
 */
function isJobDue(schedule) {
  try {
    const interval = cronParser.parseExpression(schedule, {
      currentDate: new Date()
    });

    const prev = interval.prev().getTime(); // Previous scheduled run
    const now = Date.now();

    return (now - prev) <= 30000;
  } catch (e) {
    console.error(`⛔ Invalid cron schedule: ${schedule}`);
    return false;
  }
}

module.exports = { isJobDue };