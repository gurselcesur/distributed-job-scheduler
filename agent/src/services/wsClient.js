const WebSocket = require('ws');
const os = require('os');
const { exec } = require('child_process');
const { updateJobStatus } = require('./apiService');
const AGENT_ID = process.env.AGENT_ID || null;

const WS_URL = 'wss://84ca-88-230-89-0.ngrok-free.app';       // WebSocket

function startWebSocketClient(agentId) {
  const ws = new WebSocket(WS_URL);

  ws.on('open', () => {
    console.log(`🔌 Connected to relay-server over WebSocket`);

    // Register this agent
    ws.send(JSON.stringify({
      type: 'register',
      agentId
    }));
  });

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'run_job') {
        const job = msg.job;
        console.log(`▶️ Received job via WS: ${job.command}`);

        const start = Date.now();
        exec(job.command, async (err, stdout, stderr) => {
          const end = Date.now();
          const delay = end - start;

          if (err) {
            console.error(`Job failed: ${err.message}`);
            await updateJobStatus(job.id, {
              status: 'failed',
              retryCount: (job.retryCount || 0) + 1,
              lastError: err.message,
              lastRunAt: new Date().toISOString(),
              delayMs: delay
            });
          } else {
            console.log(`Job output:\n${stdout}`);
            await updateJobStatus(job.id, {
              status: 'success',
              retryCount: 0,
              lastError: null,
              lastRunAt: new Date().toISOString(),
              delayMs: delay
            });
          }
        });
      }
    } catch (err) {
      console.error('Invalid WS message format:', err.message);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    setTimeout(() => startWebSocketClient(agentId), 5000); // Auto-reconnect
  });

  ws.on('error', (err) => {
    console.error('WS Error:', err.message);
  });
}

module.exports = { startWebSocketClient };