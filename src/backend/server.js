const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Mevcut görevleri oku
app.get('/tasks', async (req, res) => {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Görevler okunamadı' });
  }
});

// Yeni görev ekle
app.post('/tasks', async (req, res) => {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    const tasks = JSON.parse(data);
    
    const newTask = {
      command: req.body.command,
      id: tasks.length + 1,
      schedule: req.body.schedule,
      username: "test_user"
    };
    
    tasks.push(newTask);
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
    
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Görev eklenemedi' });
  }
});

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 