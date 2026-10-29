import * as RadixPopover from '@radix-ui/react-popover'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/utils/cn'

export const Popover = RadixPopover.Root
export const PopoverTrigger = RadixPopover.Trigger

export function PopoverContent({ className, align = 'start', sideOffset = 8, ...props }: ComponentPropsWithoutRef<typeof RadixPopover.Content>) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        align={align}
        sideOffset={sideOffset}
        className={cn('z-50 animate-fade-in rounded-xl border border-slate-200 bg-white shadow-pop outline-none', className)}
        {...props}
      />
    </RadixPopover.Portal>
  )
}
