import { addDays, formatDateISO, startOfMonth, parseISODate } from '../../lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { colors } from '../../theme/colors';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export function MonthView({ monthDate, tasks, onSelectDay }) {
  const start = startOfMonth(monthDate);
  let cursor = new Date(start);
  const dow = cursor.getDay();
  const offset = dow === 0 ? 6 : dow - 1;
  cursor = addDays(cursor, -offset);

  const cells = [];
  for (let i = 0; i < 42; i++) {
    cells.push(addDays(cursor, i));
  }

  function countByDate(iso) {
    return tasks.filter((t) => t.date === iso);
  }

  return (
    <div className="glass-panel overflow-x-auto p-2 sm:p-4">
      <div className="mb-2 grid min-w-[280px] grid-cols-7 gap-0.5 text-center text-[10px] text-muted sm:mb-3 sm:gap-1 sm:text-xs">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid min-w-[280px] grid-cols-7 gap-0.5 sm:gap-1">
        {cells.map((day) => {
          const iso = formatDateISO(day);
          const inMonth = day.getMonth() === monthDate.getMonth();
          const dayTasks = countByDate(iso);
          const hasCritical = dayTasks.some((t) => t.priority === 'critical');
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDay?.(parseISODate(iso))}
              className={`min-h-[52px] rounded-md border p-0.5 text-left text-[10px] transition-colors hover:border-neon/40 sm:min-h-[72px] sm:rounded-lg sm:p-1 sm:text-xs ${
                inMonth ? 'border-white/10 bg-bg-space/30' : 'border-transparent opacity-40'
              } ${hasCritical ? 'priority-critical' : ''}`}
            >
              <span className="font-medium">{day.getDate()}</span>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {dayTasks.slice(0, 4).map((t) => (
                  <span
                    key={t.id}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: colors.priority[t.priority] || colors.priority.normal }}
                  />
                ))}
              </div>
              {dayTasks.length > 0 && (
                <span className="text-[10px] text-muted">{dayTasks.length} tâche(s)</span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted capitalize">{format(monthDate, 'MMMM yyyy', { locale: fr })}</p>
    </div>
  );
}
