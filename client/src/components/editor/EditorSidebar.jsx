import { motion } from 'framer-motion';
import { ListTodo, PenLine } from 'lucide-react';
import { TaskForm } from '../tasks/TaskForm';
import { TaskCard } from '../tasks/TaskCard';
import { formatDateISO } from '../../lib/utils';
import { cn } from '../../lib/utils';

const viewLabels = { day: 'du jour', week: 'de la semaine', month: 'du mois', year: "de l'année" };

export function EditorSidebar({
  isEditor,
  focusDate,
  editing,
  setEditing,
  tasks,
  view,
  anchor,
  loading,
  error,
  onSave,
  onDelete,
}) {
  const filtered =
    view === 'day' ? tasks.filter((t) => t.date === formatDateISO(anchor)) : tasks;

  return (
    <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-4 lg:self-start">
      {isEditor ? (
        <div
          id="editor-form-panel"
          className={cn(
            'scroll-mt-4 rounded-xl border border-neon/20 shadow-glow-cyan',
            editing && 'ring-1 ring-neon/40'
          )}
        >
          <div className="flex items-center gap-2 border-b border-neon/10 px-4 py-3">
            <PenLine size={16} className="shrink-0 text-neon" />
            <span className="text-xs font-semibold uppercase tracking-wide text-vibrant">
              {editing ? 'Modification' : 'Mode écriture'}
            </span>
          </div>
          <TaskForm
            focusDate={focusDate}
            initial={editing}
            onSubmit={async (form) => {
              await onSave(form);
              setEditing(null);
              if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
                document.getElementById('task-list-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            onCancel={editing ? () => setEditing(null) : undefined}
            embedded
          />
        </div>
      ) : (
        <p className="glass-panel p-4 text-sm leading-relaxed text-muted">
          Mode lecture seule. Connectez-vous en mode éditeur pour ajouter ou modifier des tâches.
        </p>
      )}

      <section id="task-list-panel" className="glass-panel flex min-h-0 scroll-mt-4 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-neon/10 px-3 py-3 sm:px-4">
          <h2 className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-vibrant">
            <ListTodo size={18} className="shrink-0" aria-hidden />
            <span className="truncate leading-normal">Tâches {viewLabels[view]}</span>
          </h2>
          <span
            className="inline-flex h-7 min-w-[1.75rem] shrink-0 items-center justify-center rounded-full border border-neon/25 bg-electric/20 px-2 text-xs font-semibold tabular-nums leading-none text-neon"
            aria-label={`${filtered.length} tâche(s)`}
          >
            {filtered.length}
          </span>
        </header>

        <div className="scroll-area-thin max-h-none overflow-visible p-3 sm:max-h-[min(420px,45dvh)] sm:overflow-y-auto sm:overscroll-contain sm:p-4 sm:pt-3">
          {loading && <p className="text-sm text-muted">Chargement…</p>}
          {error && (
            <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              <p>{error}</p>
              <button
                type="button"
                className="mt-2 text-neon underline"
                onClick={() => window.location.reload()}
              >
                Recharger la page
              </button>
            </div>
          )}

          <ul className="space-y-3">
            {filtered.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  isEditor={isEditor}
                  onEdit={(t) => {
                    setEditing(t);
                    document.getElementById('editor-form-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  onDelete={onDelete}
                />
              </li>
            ))}
          </ul>

          {!loading && filtered.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 text-center text-sm text-muted">
              Aucune tâche sur cette période.
            </motion.p>
          )}
        </div>
      </section>
    </aside>
  );
}
