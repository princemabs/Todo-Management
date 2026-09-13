import { Router } from 'express';
import { readPlanner, filterTasksByRange } from '../store/plannerStore.js';

const router = Router();

function todayInParis() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

router.get('/today', async (_req, res) => {
  try {
    const data = await readPlanner();
    const displayDate = data.meta.publicDisplayDate || todayInParis();
    const tasks = filterTasksByRange(data.tasks, displayDate, displayDate).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
    res.json({
      ownerDisplayName: data.meta.ownerDisplayName,
      displayDate,
      isCustomDate: Boolean(data.meta.publicDisplayDate),
      tasks,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
