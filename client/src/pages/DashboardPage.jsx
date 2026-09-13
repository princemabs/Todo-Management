import { useMemo, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { EditorSidebar } from '../components/editor/EditorSidebar';
import { TimeViewTabs } from '../components/planner/TimeViewTabs';
import {
  DateNavigator,
  formatDayLabel,
  formatWeekLabel,
  formatMonthLabel,
  formatYearLabel,
} from '../components/planner/DateNavigator';
import { DayTimeline } from '../components/planner/DayTimeline';
import { WeekView } from '../components/planner/WeekView';
import { MonthView } from '../components/planner/MonthView';
import { YearView } from '../components/planner/YearView';
import { PublicDateControl } from '../components/planner/PublicDateControl';
import { useEditorAuth } from '../context/EditorAuthContext';
import { useTasks } from '../hooks/useTasks';
import {
  addDays,
  formatDateISO,
  startOfWeek,
  startOfMonth,
  endOfMonth,
} from '../lib/utils';
import { cn } from '../lib/utils';

function getRange(view, anchor) {
  if (view === 'day') {
    const iso = formatDateISO(anchor);
    return { from: iso, to: iso, label: formatDayLabel(anchor) };
  }
  if (view === 'week') {
    const start = startOfWeek(anchor);
    const end = addDays(start, 6);
    return { from: formatDateISO(start), to: formatDateISO(end), label: formatWeekLabel(start), weekStart: start };
  }
  if (view === 'month') {
    const start = startOfMonth(anchor);
    const end = endOfMonth(anchor);
    return { from: formatDateISO(start), to: formatDateISO(end), label: formatMonthLabel(anchor) };
  }
  const y = anchor.getFullYear();
  return { from: `${y}-01-01`, to: `${y}-12-31`, label: formatYearLabel(anchor) };
}

function shiftAnchor(view, anchor, dir) {
  const d = new Date(anchor);
  if (view === 'day') d.setDate(d.getDate() + dir);
  else if (view === 'week') d.setDate(d.getDate() + dir * 7);
  else if (view === 'month') d.setMonth(d.getMonth() + dir);
  else d.setFullYear(d.getFullYear() + dir);
  return d;
}

export function DashboardPage() {
  const { isEditor } = useEditorAuth();
  const [view, setView] = useState('day');
  const [anchor, setAnchor] = useState(() => new Date());
  const [editing, setEditing] = useState(null);

  const range = useMemo(() => getRange(view, anchor), [view, anchor]);
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks(range.from, range.to);

  async function handleSave(form) {
    if (editing) await updateTask(editing.id, form);
    else await createTask(form);
    setEditing(null);
  }

  return (
    <AppShell subtitle="Tableau de productivité personnel — cyber-minimal">
      <div className="space-y-4 sm:space-y-6">
        <PublicDateControl focusDate={anchor} isEditor={isEditor} />

        <DateNavigator
          label={range.label}
          onPrev={() => setAnchor((a) => shiftAnchor(view, a, -1))}
          onNext={() => setAnchor((a) => shiftAnchor(view, a, 1))}
        />

        <div
          className={cn(
            'grid min-w-0 gap-6',
            isEditor
              ? 'max-lg:flex max-lg:flex-col lg:grid-cols-[minmax(0,1fr)_min(100%,400px)] xl:grid-cols-[minmax(0,1fr)_420px]'
              : 'mx-auto max-w-5xl'
          )}
        >
          <section className={cn('min-w-0', isEditor ? 'order-2 lg:order-1' : 'order-1')}>
            <TimeViewTabs
              view={view}
              onViewChange={setView}
              dayPanel={
                <DayTimeline
                  tasks={tasks.filter((t) => t.date === formatDateISO(anchor))}
                  dateLabel={formatDayLabel(anchor)}
                />
              }
              weekPanel={<WeekView weekStart={range.weekStart || startOfWeek(anchor)} tasks={tasks} />}
              monthPanel={
                <MonthView
                  monthDate={anchor}
                  tasks={tasks}
                  onSelectDay={(d) => {
                    setAnchor(d);
                    setView('day');
                  }}
                />
              }
              yearPanel={<YearView yearDate={anchor} tasks={tasks} />}
            />
          </section>

          <div className={cn('min-w-0', isEditor ? 'order-1 lg:order-2' : 'order-2')}>
            <EditorSidebar
              isEditor={isEditor}
              focusDate={anchor}
              editing={editing}
              setEditing={setEditing}
              tasks={tasks}
              view={view}
              anchor={anchor}
              loading={loading}
              error={error}
              onSave={handleSave}
              onDelete={deleteTask}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
