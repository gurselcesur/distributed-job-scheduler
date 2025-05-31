const http = require('http');
const{ startWebSocketServer } = require('./wsServer');
const express = require('express');
const cors = require('cors');
const db = require('./models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'super-secret-key';
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ====================================
// JWT Middleware
// ====================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token is missing' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ====================================
// Routes
// ====================================

// Create a new user (Register)
app.post('/users', async (req, res) => {
  const { username, password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await db.User.create({
      username,
      password_hash: hashedPassword
    });
    res.status(201).json({ message: 'User created successfully.', userId: newUser.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login and get JWT
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await db.User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid username or password.' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid username or password.' });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Update job status (used by agent)
app.patch('/jobs/:id', async (req, res) => {
  const { id } = req.params;
  const { status, lastRunAt, retryCount, lastError } = req.body;

  try {
    const job = await db.Job.findByPk(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (status) job.status = status;
    if (lastRunAt) job.lastRunAt = lastRunAt;
    if (typeof retryCount === 'number') job.retryCount = retryCount;
    if (lastError !== undefined) job.lastError = lastError;

    await job.save();
    res.json({ message: 'Job updated', job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all agents (no token required)
app.get('/agents', async (req, res) => {
  try {
    const agents = await db.Agent.findAll({
      attributes: ['id', 'hostname', 'ip', 'lastSeen']
    });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents.' });
  }
});

// Register a new agent
app.post('/agents', async (req, res) => {
  const { hostname, ip } = req.body;

  try {
    let agent = await db.Agent.findOne({ where: { hostname, ip } });

    if (agent) {
      // If there is an agent with same IP update lastSeen
      agent.lastSeen = new Date();
      await agent.save();
    } else {
      // If no, create new one
      agent = await db.Agent.create({
        hostname,
        ip,
        lastSeen: new Date()
      });
    }

    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/jobs', authenticateToken, async (req, res) => {
  const { command, schedule, agentId } = req.body;
  try {
    const newJob = await db.Job.create({
      command,
      schedule,
      agentId,
      userId: req.user.id
    });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/jobs', authenticateToken, async (req, res) => {
  try {
    const jobs = await db.Job.findAll({
      where: { userId: req.user.id },
      include: [{ model: db.Agent, attributes: ['hostname', 'ip'] }]
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
});

app.post('/agents/heartbeat', async (req, res) => {
  const { agentId } = req.body;
  if (!agentId) return res.status(400).json({ error: 'Missing agentId' });

  try {
    const agent = await db.Agent.findByPk(agentId);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    agent.lastSeen = new Date();
    await agent.save();

    res.status(200).json({ message: 'Heartbeat received' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you are authorized.` });
});

// Delete a job
app.delete('/jobs/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const job = await db.Job.findOne({
      where: { 
        id: id,
        userId: req.user.id // Sadece kendi işlerini silebilmeli
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'İş bulunamadı veya bu işi silme yetkiniz yok.' });
    }

    await job.destroy();
    res.json({ message: 'İş başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================================
// Start Server and Sync DB
// ====================================
db.sequelize.sync({ force: false }).then(async () => {
  console.log("SQLite database connected.");
  const server = http.createServer(app);
  startWebSocketServer(server);
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});