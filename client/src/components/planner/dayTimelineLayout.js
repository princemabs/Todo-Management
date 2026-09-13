const TRACK_HEIGHT = 720;
const MIN_BLOCK_PX = 56;
const DAY_MINUTES = 24 * 60;

export function minutesFromMidnight(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function layoutDayTasks(tasks) {
  const items = tasks
    .map((task) => {
      const start = minutesFromMidnight(task.startTime);
      const end = minutesFromMidnight(task.endTime);
      const duration = Math.max(end - start, 15);
      const topPx = (start / DAY_MINUTES) * TRACK_HEIGHT;
      const heightPx = Math.max((duration / DAY_MINUTES) * TRACK_HEIGHT, MIN_BLOCK_PX);
      return { task, start, end, topPx, heightPx, col: 0, cols: 1 };
    })
    .sort((a, b) => a.start - b.start || a.end - b.end);

  const active = [];

  for (const item of items) {
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].end <= item.start) active.splice(i, 1);
    }
    const taken = new Set(active.map((a) => a.col));
    let col = 0;
    while (taken.has(col)) col += 1;
    item.col = col;
    active.push(item);
  }

  for (const item of items) {
    const overlap = items.filter((o) => o.start < item.end && o.end > item.start);
    item.cols = Math.max(1, overlap.length);
  }

  return { items, trackHeight: TRACK_HEIGHT };
}

export function isDayPlanningComplete(tasks) {
  return tasks.length > 0 && tasks.every((t) => t.status === 'done');
}
