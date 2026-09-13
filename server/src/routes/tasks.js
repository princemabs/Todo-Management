import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireEditor } from '../middleware/auth.js';
import {
  readPlanner,
  writePlanner,
  filterTasksByRange,
  validateTaskTimes,
} from '../store/plannerStore.js';

const router = Router();
const PRIORITIES = ['normal', 'important', 'urgent', 'critical'];
const STATUSES = ['todo', 'in_progress', 'done'];

function sanitizeTaskBody(body, partial = false) {
  const fields = {};
  if (!partial || body.title !== undefined) fields.title = String(body.title || '').trim();
  if (!partial || body.description !== undefined) fields.description = String(body.description || '');
  if (!partial || body.date !== undefined) fields.date = String(body.date || '');
  if (!partial || body.startTime !== undefined) fields.startTime = String(body.startTime || '');
  if (!partial || body.endTime !== undefined) fields.endTime = String(body.endTime || '');
  if (!partial || body.priority !== undefined) fields.priority = body.priority;
  if (!partial || body.status !== undefined) fields.status = body.status;
  if (!partial || body.publishOnPublicView !== undefined) {
    fields.publishOnPublicView = Boolean(body.publishOnPublicView);
  }
  return fields;
}

function validateTask(task, partial = false) {
  if (!partial && !task.title) return 'title is required';
  if (!partial && !/^\d{4}-\d{2}-\d{2}$/.test(task.date)) return 'invalid date';
  if (task.priority && !PRIORITIES.includes(task.priority)) return 'invalid priority';
  if (task.status && !STATUSES.includes(task.status)) return 'invalid status';
  if (task.startTime && task.endTime) {
    const v = validateTaskTimes(task.startTime, task.endTime);
    if (!v.ok) return v.error;
  }
  return null;
}

router.get('/', async (req, res) => {
  try {
    const { from, to } = req.query;
    const data = await readPlanner();
    let tasks = data.tasks;
    if (from && to) tasks = filterTasksByRange(tasks, from, to);
    res.json({ tasks });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await readPlanner();
    const task = data.tasks.find((t) => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json({ task });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', requireEditor, async (req, res) => {
  try {
    const task = sanitizeTaskBody(req.body);
    task.priority = task.priority || 'normal';
    task.status = task.status || 'todo';
    const err = validateTask(task);
    if (err) return res.status(400).json({ error: err });

    const data = await readPlanner();
    const newTask = { id: uuidv4(), ...task };
    data.tasks.push(newTask);
    await writePlanner(data);
    res.status(201).json({ task: newTask });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', requireEditor, async (req, res) => {
  try {
    const data = await readPlanner();
    const idx = data.tasks.findIndex((t) => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });

    const merged = { ...data.tasks[idx], ...sanitizeTaskBody(req.body, true) };
    const err = validateTask(merged);
    if (err) return res.status(400).json({ error: err });

    data.tasks[idx] = merged;
    await writePlanner(data);
    res.json({ task: merged });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', requireEditor, async (req, res) => {
  try {
    const data = await readPlanner();
    const before = data.tasks.length;
    data.tasks = data.tasks.filter((t) => t.id !== req.params.id);
    if (data.tasks.length === before) return res.status(404).json({ error: 'Not found' });
    await writePlanner(data);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
