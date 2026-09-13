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
          'glass-panel neon-hover fixed left-1/2 top-1/2 z-50 w-[min(420px,92vw)] -translate-x-1/2 -translate-y-1/2 p-6 shadow-glow-cyan',
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <Dialog.Title className="text-lg font-semibold text-neon">{title}</Dialog.Title>
          <Dialog.Close className="rounded-md p-1 text-muted hover:text-neon">
            <X size={18} />
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
