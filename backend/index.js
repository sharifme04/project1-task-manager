const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];

app.get('/tasks', (req, res) => res.json(tasks));

app.post('/tasks', (req, res) => {
  if (!req.body.title || typeof req.body.title !== 'string') {
    return res.status(400).json({ error: 'title is required' });
  }
  const task = { id: Date.now(), title: req.body.title.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.patch('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Not found' });
  task.done = !task.done;
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== Number(req.params.id));
  if (tasks.length === before) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[Project 1] Task Manager backend running on http://localhost:${PORT}`);
  console.log('  GET    /tasks');
  console.log('  POST   /tasks   { "title": "..." }');
  console.log('  PATCH  /tasks/:id');
  console.log('  DELETE /tasks/:id');
});
