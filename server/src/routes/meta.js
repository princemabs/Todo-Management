import { Router } from 'express';
import { requireEditor } from '../middleware/auth.js';
import { readPlanner, writePlanner } from '../store/plannerStore.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const data = await readPlanner();
    res.json({ meta: data.meta });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/', requireEditor, async (req, res) => {
  try {
    const data = await readPlanner();
    const { publicDisplayDate, ownerDisplayName } = req.body || {};

    if (publicDisplayDate !== undefined) {
      if (publicDisplayDate === null || publicDisplayDate === '') {
        data.meta.publicDisplayDate = null;
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(publicDisplayDate)) {
        data.meta.publicDisplayDate = publicDisplayDate;
      } else {
        return res.status(400).json({ error: 'invalid publicDisplayDate' });
      }
    }

    if (ownerDisplayName !== undefined) {
      data.meta.ownerDisplayName = String(ownerDisplayName).trim() || data.meta.ownerDisplayName;
    }

    await writePlanner(data);
    res.json({ meta: data.meta });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
