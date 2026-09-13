import { motion } from 'framer-motion';
import { Pencil, Trash2, Globe } from 'lucide-react';
import { PriorityBadge } from './PriorityBadge';
import { Button } from '../ui/button';
import { durationHours } from '../../lib/utils';
import { cn } from '../../lib/utils';

const statusLabel = { todo: 'À faire', in_progress: 'En cours', done: 'Terminé' };

export function TaskCard({ task, isEditor, onEdit, onDelete }) {
  const hours = durationHours(task.startTime, task.endTime);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'glass-panel neon-hover p-3 sm:p-4',
        task.priority === 'critical' && 'priority-critical'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={cn('truncate font-semibold text-text', task.status === 'done' && 'line-through opacity-60')}>
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted">{task.description}</p>
          )}
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
        <span className="font-medium text-neon">
          {task.startTime} → {task.endTime}
        </span>
        <span className="text-muted">({hours}h)</span>
        <span className="rounded-md border border-white/10 px-2 py-0.5 text-muted">{statusLabel[task.status]}</span>
        {task.publishOnPublicView && (
          <span className="inline-flex items-center gap-1 text-neon">
            <Globe size={12} /> Public
          </span>
        )}
      </div>

      {isEditor && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Button
            variant="outline"
            className="min-h-10 w-full text-xs sm:w-auto sm:px-3"
            onClick={() => onEdit(task)}
          >
            <Pencil size={14} /> Modifier
          </Button>
          <Button
            variant="danger"
            className="min-h-10 w-full text-xs sm:w-auto sm:px-3"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={14} /> Supprimer
          </Button>
        </div>
      )}
    </motion.article>
  );
}
