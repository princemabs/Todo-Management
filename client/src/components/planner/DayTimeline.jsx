import { colors } from '../../theme/colors';
import { PriorityBadge } from '../tasks/PriorityBadge';
import { PlanningCompleteCelebration } from './PlanningCompleteCelebration';
import { layoutDayTasks, isDayPlanningComplete } from './dayTimelineLayout';
import { cn } from '../../lib/utils';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function priorityStyle(priority) {
  const map = {
    normal: colors.priority.normal,
    important: colors.priority.important,
    urgent: colors.priority.urgent,
    critical: colors.priority.critical,
  };
  return map[priority] || map.normal;
}

function TimelineBlock({ item }) {
  const { task, topPx, heightPx, col, cols } = item;
  const color = priorityStyle(task.priority);
  const compact = heightPx < 64;
  const gap = 1.2;
  const widthPct = (100 - gap * 2) / cols;
  const leftPct = gap + col * widthPct;

  return (
    <div
      className={cn(
        'absolute z-10 flex min-h-0 flex-col overflow-hidden rounded-md border backdrop-blur-sm',
        compact ? 'justify-center px-2 py-1' : 'justify-start px-2.5 py-2',
        task.priority === 'critical' && 'priority-critical'
      )}
      style={{
        top: topPx,
        height: heightPx,
        left: `calc(0.5rem + ${leftPct}%)`,
        width: `calc(${widthPct}% - 0.35rem)`,
        borderColor: `${color}aa`,
        background: `${color}28`,
        boxShadow: task.priority === 'critical' ? undefined : `0 0 14px ${color}30`,
      }}
      title={task.description ? `${task.title} — ${task.description}` : task.title}
    >
      {compact ? (
        <p className="truncate text-[11px] font-medium leading-tight text-text">
          <span>{task.title}</span>
          <span className="ml-1.5 font-normal text-muted">
            {task.startTime}–{task.endTime}
          </span>
        </p>
      ) : (
        <>
          <p className="line-clamp-2 text-xs font-semibold leading-snug text-text">{task.title}</p>
          <p className="mt-auto shrink-0 pt-1 text-[11px] font-medium text-neon">
            {task.startTime} – {task.endTime}
          </p>
        </>
      )}
    </div>
  );
}

function MobileDayList({ dayTasks }) {
  if (dayTasks.length === 0) {
    return <p className="py-4 text-center text-sm text-muted md:hidden">Aucune tâche ce jour.</p>;
  }
  return (
    <ul className="space-y-2 md:hidden">
      {dayTasks.map((task) => (
        <li
          key={task.id}
          className={cn(
            'rounded-lg border border-neon/15 bg-bg-deep/50 p-3',
            task.priority === 'critical' && 'priority-critical',
            task.status === 'done' && 'opacity-80'
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <p className={cn('font-medium', task.status === 'done' && 'line-through')}>{task.title}</p>
            <PriorityBadge priority={task.priority} compact />
          </div>
          <p className="mt-1 text-sm text-neon">
            {task.startTime} → {task.endTime}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function DayTimeline({ tasks, dateLabel }) {
  const dayTasks = [...tasks].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const complete = isDayPlanningComplete(dayTasks);
  const { items, trackHeight } = layoutDayTasks(dayTasks);

  return (
    <div className="glass-panel overflow-hidden p-3 sm:p-4">
      <p className="mb-3 text-sm text-muted sm:mb-4">{dateLabel}</p>

      {complete && <PlanningCompleteCelebration className="mb-4" />}

      <MobileDayList dayTasks={dayTasks} />

      <div className="relative hidden gap-4 md:flex">
        <div
          className="flex w-12 shrink-0 flex-col justify-between py-1 text-xs text-muted"
          style={{ height: trackHeight }}
        >
          {HOURS.map((h) => (
            <span key={h}>{String(h).padStart(2, '0')}:00</span>
          ))}
        </div>
        <div
          className="relative min-w-0 flex-1 rounded-lg border border-neon/10 bg-bg-deep/50"
          style={{ height: trackHeight }}
        >
          {HOURS.map((h) => (
            <div
              key={h}
              className="pointer-events-none absolute left-0 right-0 border-t border-white/5"
              style={{ top: `${(h / 24) * 100}%` }}
            />
          ))}
          {items.map((item) => (
            <TimelineBlock key={item.task.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
