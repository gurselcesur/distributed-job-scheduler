const WebSocket = require('ws');

const agentConnections = new Map(); // agentId => ws

function startWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
      try {
        const msg = JSON.parse(message);

        if (msg.type === 'register' && msg.agentId) {
          agentConnections.set(msg.agentId, ws);
          console.log(`Agent ${msg.agentId} registered over WebSocket`);
        }

        if (msg.type === 'pong') {
          console.log(`Heartbeat pong from agent ${msg.agentId}`);
        }
      } catch (err) {
        console.error('Invalid message format', err);
      }
    });

    ws.on('close', () => {
      for (const [agentId, socket] of agentConnections.entries()) {
        if (socket === ws) {
          agentConnections.delete(agentId);
          console.log(`Agent ${agentId} disconnected`);
          break;
        }
      }
    });
  });

  console.log('WebSocket server is ready.');
}

function dispatchJobToAgent(agentId, job) {
  const ws = agentConnections.get(agentId);
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.log(`Agent ${agentId} is not connected`);
    return false;
  }

  ws.send(JSON.stringify({ type: 'run_job', job }));
  return true;
}

module.exports = {
  startWebSocketServer,
  dispatchJobToAgent,
};