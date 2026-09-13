import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = process.env.PLANNER_DATA_PATH
  ? path.resolve(process.env.PLANNER_DATA_PATH)
  : path.resolve(__dirname, '../../../data/planner.json');

const DEFAULT_DATA = {
  meta: {
    ownerDisplayName: 'Prince Mabengue',
    publicDisplayDate: null,
  },
  tasks: [],
};

let writeQueue = Promise.resolve();

function queueWrite(fn) {
  writeQueue = writeQueue.then(fn, fn);
  return writeQueue;
}

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export function getPlannerDataPath() {
  return DATA_PATH;
}

export async function ensureDataFile() {
  try {
    await fs.access(DATA_PATH);
    return;
  } catch {
    /* create below */
  }

  const dir = path.dirname(DATA_PATH);
  try {
    await ensureDir(dir);
  } catch (err) {
    if (err.code === 'EACCES' || err.code === 'EPERM') {
      throw new Error(
        `[planner] Cannot write to ${dir}. On Render: remove PLANNER_DATA_PATH to use repo data/ ` +
          `(ephemeral), OR add a Persistent Disk mounted at ${dir} before setting PLANNER_DATA_PATH.`
      );
    }
    throw err;
  }

  await fs.writeFile(DATA_PATH, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8');
}

export async function readPlanner() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

export async function writePlanner(data) {
  return queueWrite(async () => {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  });
}

export function parseTimeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function validateTaskTimes(startTime, endTime) {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (end <= start) {
    return { ok: false, error: 'endTime must be after startTime on the same day' };
  }
  return { ok: true, durationHours: (end - start) / 60 };
}

export function filterTasksByRange(tasks, from, to) {
  return tasks.filter((t) => t.date >= from && t.date <= to);
}
