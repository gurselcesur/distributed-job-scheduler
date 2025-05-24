const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Read existing tasks
app.get('/tasks', async (req, res) => {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read tasks' });
  }
});

// Add new task
app.post('/tasks', async (req, res) => {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    const tasks = JSON.parse(data);
    
    const newTask = {
      command: req.body.command,
      id: tasks.length + 1,
      schedule: req.body.schedule,
      username: req.body.username
    };
    
    tasks.push(newTask);
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
    
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 