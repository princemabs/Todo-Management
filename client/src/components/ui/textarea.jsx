import { cn } from '../../lib/utils';

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full min-h-[80px] rounded-lg border border-neon/20 bg-bg-space/80 px-3 py-2 text-base text-text outline-none focus:border-neon/50 md:text-sm',
        className
      )}
      {...props}
    />
  );
}
