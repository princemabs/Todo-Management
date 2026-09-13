import { colors } from '../../theme/colors';
import { cn } from '../../lib/utils';

const config = {
  normal: { label: 'Normal', emoji: '🟢', className: 'border-green-500/40 text-green-400' },
  important: { label: 'Important', emoji: '🔵', className: 'border-electric/50 text-vibrant' },
  urgent: { label: 'Urgent', emoji: '🟠', className: 'border-orange-500/50 text-orange-400' },
  critical: { label: 'Important & Urgent', emoji: '🔴', className: 'priority-critical text-red-300' },
};

export function PriorityBadge({ priority, compact }) {
  const c = config[priority] || config.normal;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs',
        c.className
      )}
      style={priority === 'important' ? { boxShadow: `0 0 12px ${colors.electricBlue}33` } : undefined}
    >
      {!compact && <span>{c.emoji}</span>}
      {c.label}
    </span>
  );
}

export const PRIORITY_OPTIONS = [
  { value: 'normal', label: '🟢 Normal / Faible' },
  { value: 'important', label: '🔵 Important' },
  { value: 'urgent', label: '🟠 Urgent' },
  { value: 'critical', label: '🔴 Important & Urgent' },
];

export const STATUS_OPTIONS = [
  { value: 'todo', label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'done', label: 'Terminé' },
];
