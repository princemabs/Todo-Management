import { addDays, formatDateISO } from '../../lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PriorityBadge } from '../tasks/PriorityBadge';

function DayColumn({ day, dayTasks }) {
  const iso = formatDateISO(day);
  return (
    <div className="glass-panel neon-hover min-h-[120px] min-w-[240px] shrink-0 snap-start p-3 md:min-w-0">
      <p className="mb-2 text-xs font-semibold capitalize text-vibrant">{format(day, 'EEE d', { locale: fr })}</p>
      <ul className="space-y-2">
        {dayTasks.length === 0 && <li className="text-xs text-muted">—</li>}
        {dayTasks.map((t) => (
          <li key={t.id} className="rounded border border-white/5 bg-bg-space/40 p-2 text-xs">
            <p className="truncate font-medium">{t.title}</p>
            <p className="text-muted">
              {t.startTime}–{t.endTime}
            </p>
            <PriorityBadge priority={t.priority} compact />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WeekView({ weekStart, tasks }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <>
      <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:hidden">
        {days.map((day) => {
          const iso = formatDateISO(day);
          const dayTasks = tasks.filter((t) => t.date === iso).sort((a, b) => a.startTime.localeCompare(b.startTime));
          return <DayColumn key={iso} day={day} dayTasks={dayTasks} />;
        })}
      </div>
      <div className="hidden gap-3 md:grid md:grid-cols-7">
        {days.map((day) => {
          const iso = formatDateISO(day);
          const dayTasks = tasks.filter((t) => t.date === iso).sort((a, b) => a.startTime.localeCompare(b.startTime));
          return <DayColumn key={iso} day={day} dayTasks={dayTasks} />;
        })}
      </div>
    </>
  );
}
