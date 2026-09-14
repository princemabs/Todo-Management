import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function DialogRoot({ children, ...props }) {
  return <Dialog.Root {...props}>{children}</Dialog.Root>;
}

export function DialogTrigger({ className, ...props }) {
  return <Dialog.Trigger className={className} {...props} />;
}

export function DialogContent({ className, children, title }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
      <Dialog.Content
        className={cn(
          'glass-panel fixed z-50 flex max-h-[min(92dvh,100%)] w-full flex-col overflow-y-auto overscroll-contain shadow-glow-cyan',
          'inset-x-0 bottom-0 max-h-[90dvh] rounded-t-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5',
          'md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[min(420px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:p-6',
          className
        )}
      >
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <Dialog.Title className="text-lg font-semibold text-neon">{title}</Dialog.Title>
          <Dialog.Close className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted active:bg-white/10">
            <X size={20} />
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
