import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const nativeClass =
  'flex w-full min-h-11 items-center rounded-lg border border-neon/20 bg-bg-space/80 px-3 py-2 text-base text-text outline-none focus:border-neon/50 md:hidden';

export function SelectField({ value, onValueChange, placeholder, options }) {
  return (
    <>
      <select
        className={nativeClass}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        aria-label={placeholder}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger
          className={cn(
            'hidden min-h-11 w-full items-center justify-between rounded-lg border border-neon/20 bg-bg-space/80 px-3 py-2 text-sm text-text outline-none focus:border-neon/50 md:flex'
          )}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown size={16} className="text-muted" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={6}
            className="glass-panel z-[100] max-h-[min(280px,50dvh)] overflow-hidden rounded-lg border border-neon/20 p-1 shadow-glow-cyan"
          >
            <Select.Viewport className="p-1">
              {options.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  className="flex min-h-11 cursor-pointer items-center justify-between rounded-md px-3 py-2 text-base outline-none data-[highlighted]:bg-electric/25 md:text-sm"
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={14} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </>
  );
}
