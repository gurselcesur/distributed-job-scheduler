const express = require('express');
const db = require('./models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'super-secret-key';
const app = express();
const PORT = 3000;

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
    const newAgent = await db.Agent.create({
      hostname,
      ip,
      lastSeen: new Date()
    });
    res.status(201).json(newAgent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you are authorized.` });
});

// ====================================
// Start Server and Sync DB
// ====================================
db.sequelize.sync().then(() => {
  console.log("✅ SQLite database connected.");
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});