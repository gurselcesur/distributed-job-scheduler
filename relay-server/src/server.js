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

// Login and get JWT - TEST MODE: Any username/password works
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // TEST MODE: Accept any non-empty username and password
  if (!username || !password) {
    return res.status(401).json({ error: 'Username and password required.' });
  }

  try {
    // In test mode, create a token for any valid input
    const token = jwt.sign(
      { id: 1, username: username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.' });
  }
  
  // TODO: Production mode - uncomment below and remove test mode above
  /*
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
  */
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


// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello ${req.user.username}, you are authorized.` });
});

// ====================================
// Start Server and Sync DB
// ====================================
db.sequelize.sync({ force: true }).then(() => {
    // !!!!!!!!!!
    console.log("⚠️ SQLite DB dropped and recreated."); // development bittikten sonra burayı kaldır(force:true)'da kaldır!
    //console.log("✅ SQLite database connected.");
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
});