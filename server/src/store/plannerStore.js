import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_DATA = {
  meta: {
    ownerDisplayName: 'Prince Mabengue',
    publicDisplayDate: null,
  },
  tasks: [],
};

function repoSeedPath() {
  return path.resolve(__dirname, '../../../data/planner.json');
}

/** Chemin writable en prod (Render) : disque /var/data ou server/data */
function resolveDataPath() {
  if (process.env.PLANNER_DATA_PATH) {
    return path.resolve(process.env.PLANNER_DATA_PATH);
  }

  if (process.env.NODE_ENV === 'production') {
    try {
      fs.accessSync('/var/data', fs.constants.W_OK);
      return '/var/data/planner.json';
    } catch {
      return path.join(process.cwd(), 'data', 'planner.json');
    }
  }

  return repoSeedPath();
}

const DATA_PATH = resolveDataPath();
const BACKUP_PATH = `${DATA_PATH}.bak`;
const TEMP_PATH = `${DATA_PATH}.tmp`;

let writeQueue = Promise.resolve();

function queueWrite(fn) {
  writeQueue = writeQueue.then(fn, fn);
  return writeQueue;
}

function normalizePlanner(raw) {
  const data = raw && typeof raw === 'object' ? raw : {};
  return {
    meta: {
      ownerDisplayName: data.meta?.ownerDisplayName || DEFAULT_DATA.meta.ownerDisplayName,
      publicDisplayDate: data.meta?.publicDisplayDate ?? null,
    },
    tasks: Array.isArray(data.tasks) ? data.tasks : [],
  };
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function seedFromRepoIfEmpty() {
  let needsSeed = true;
  try {
    const raw = await fsp.readFile(DATA_PATH, 'utf-8');
    const parsed = normalizePlanner(JSON.parse(raw));
    needsSeed = parsed.tasks.length === 0;
  } catch {
    needsSeed = true;
  }

  if (!needsSeed) return;

  try {
    const seedRaw = await fsp.readFile(repoSeedPath(), 'utf-8');
    const seed = normalizePlanner(JSON.parse(seedRaw));
    if (seed.tasks.length === 0 && !seed.meta.publicDisplayDate) return;
    await ensureDir(path.dirname(DATA_PATH));
    await atomicWrite(JSON.stringify(seed, null, 2));
  } catch {
    /* pas de seed dispo */
  }
}

async function atomicWrite(content) {
  await ensureDir(path.dirname(DATA_PATH));
  await fsp.writeFile(TEMP_PATH, content, 'utf-8');
  try {
    await fsp.access(DATA_PATH);
    await fsp.copyFile(DATA_PATH, BACKUP_PATH);
  } catch {
    /* premier enregistrement */
  }
  await fsp.rename(TEMP_PATH, DATA_PATH);
}

export function getPlannerDataPath() {
  return DATA_PATH;
}

export async function ensureDataFile() {
  try {
    await fsp.access(DATA_PATH);
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
        `[planner] Cannot write to ${dir}. Mount a Render disk at /var/data or set PLANNER_DATA_PATH.`
      );
    }
    throw err;
  }

  await atomicWrite(JSON.stringify(DEFAULT_DATA, null, 2));
  await seedFromRepoIfEmpty();
}

async function readRawWithRecovery() {
  try {
    return await fsp.readFile(DATA_PATH, 'utf-8');
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    await ensureDataFile();
    return await fsp.readFile(DATA_PATH, 'utf-8');
  }
}

export async function readPlanner() {
  let raw;
  try {
    raw = await readRawWithRecovery();
    return normalizePlanner(JSON.parse(raw));
  } catch (parseErr) {
    console.error('[planner] JSON corrupt, trying backup:', parseErr.message);
    try {
      const bak = await fsp.readFile(BACKUP_PATH, 'utf-8');
      const data = normalizePlanner(JSON.parse(bak));
      await writePlanner(data);
      return data;
    } catch {
      throw new Error('[planner] Data file corrupt and backup unavailable');
    }
  }
}

export async function writePlanner(data) {
  const normalized = normalizePlanner(data);
  const content = JSON.stringify(normalized, null, 2);
  return queueWrite(async () => {
    await atomicWrite(content);
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
