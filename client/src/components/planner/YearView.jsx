import { formatDateISO, startOfMonth, endOfMonth } from '../../lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function YearView({ yearDate, tasks }) {
  const year = yearDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, m) => new Date(year, m, 1));

  function countMonth(m) {
    const start = formatDateISO(startOfMonth(m));
    const end = formatDateISO(endOfMonth(m));
    return tasks.filter((t) => t.date >= start && t.date <= end).length;
  }

  const max = Math.max(1, ...months.map(countMonth));

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {months.map((m) => {
        const n = countMonth(m);
        const intensity = n / max;
        return (
          <div key={m.getMonth()} className="glass-panel neon-hover p-4">
            <p className="text-sm font-medium capitalize text-vibrant">{format(m, 'MMMM', { locale: fr })}</p>
            <p className="mt-1 text-2xl font-semibold text-neon">{n}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg-deep">
              <div
                className="h-full rounded-full bg-gradient-to-r from-electric to-neon"
                style={{ width: `${intensity * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
