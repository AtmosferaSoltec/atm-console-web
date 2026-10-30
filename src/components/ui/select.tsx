import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import type { SelectProps } from '@/types/ui.types'
import { cn } from '@/utils/cn'

export function Select({ id, value, onValueChange, options, placeholder, leadingIcon: LeadingIcon, className, disabled, 'aria-label': ariaLabel }: SelectProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <RadixSelect.Trigger
        id={id}
        aria-label={ariaLabel}
        className={cn(
          'flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 data-[placeholder]:text-slate-400 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          className,
        )}
      >
        {LeadingIcon && <LeadingIcon className="size-4 shrink-0 text-slate-400" />}
        <span className="min-w-0 flex-1 truncate text-left">
          <RadixSelect.Value placeholder={placeholder} />
        </span>
        <RadixSelect.Icon>
          <ChevronDown className="size-4 text-slate-400" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className="z-50 min-w-[var(--radix-select-trigger-width)] animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-pop"
        >
          <RadixSelect.Viewport>
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer items-center rounded-lg py-2 pr-8 pl-3 text-sm text-slate-700 outline-none select-none data-[highlighted]:bg-slate-100 data-[state=checked]:font-medium data-[state=checked]:text-brand-700"
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="absolute right-2.5">
                  <Check className="size-4" />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
