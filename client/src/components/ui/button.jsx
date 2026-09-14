import { cn } from '../../lib/utils';

export function Button({ className, variant = 'default', ...props }) {
  const variants = {
    default:
      'bg-electric/90 hover:bg-electric text-white shadow-glow-blue border border-vibrant/30',
    ghost: 'bg-transparent hover:bg-white/5 text-muted hover:text-neon border border-transparent',
    outline: 'bg-transparent border border-neon/25 hover:border-neon/50 text-text',
    danger: 'bg-red-600/80 hover:bg-red-600 text-white border border-red-400/30',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
