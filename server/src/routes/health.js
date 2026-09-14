import { Router } from 'express';
import { readPlanner, getPlannerDataPath } from '../store/plannerStore.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

router.get('/data-info', async (_req, res) => {
  try {
    const data = await readPlanner();
    res.json({
      path: getPlannerDataPath(),
      taskCount: data.tasks.length,
      meta: data.meta,
    });
  } catch (e) {
    res.status(500).json({ error: e.message, path: getPlannerDataPath() });
  }
});

export default router;
