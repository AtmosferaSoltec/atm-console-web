import * as RadixTabs from '@radix-ui/react-tabs'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/utils/cn'

export const Tabs = RadixTabs.Root

export function TabsList({ className, ...props }: ComponentPropsWithoutRef<typeof RadixTabs.List>) {
  return <RadixTabs.List className={cn('flex gap-1 border-b border-slate-200 px-5', className)} {...props} />
}

export function TabsTrigger({ className, ...props }: ComponentPropsWithoutRef<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      className={cn(
        '-mb-px cursor-pointer border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:text-slate-900 data-[state=active]:border-brand-600 data-[state=active]:text-brand-700',
        className,
      )}
      {...props}
    />
  )
}

export const TabsContent = RadixTabs.Content
