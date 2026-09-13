import { motion } from 'framer-motion';
import { PriorityBadge } from './PriorityBadge';
import { cn } from '../../lib/utils';

export function PublicTaskCard({ task, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'glass-panel neon-hover p-4',
        task.priority === 'critical' && 'priority-critical'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-text">{task.title}</h3>
        <PriorityBadge priority={task.priority} />
      </div>
      {task.description && <p className="mt-2 text-sm text-muted">{task.description}</p>}
      <p className="mt-3 text-sm font-medium text-neon">
        {task.startTime} → {task.endTime}
      </p>
    </motion.article>
  );
}
