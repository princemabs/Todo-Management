import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

export function TabsRoot({ className, ...props }) {
  return <Tabs.Root className={cn('w-full', className)} {...props} />;
}

export function TabsList({ className, ...props }) {
  return (
    <Tabs.List
      className={cn(
        'glass-panel inline-flex gap-1 p-1',
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }) {
  return (
    <Tabs.Trigger
      className={cn(
        'rounded-md px-4 py-2 text-sm text-muted transition-all data-[state=active]:bg-electric/30 data-[state=active]:text-neon data-[state=active]:shadow-glow-cyan',
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }) {
  return <Tabs.Content className={cn('mt-4 outline-none', className)} {...props} />;
}
