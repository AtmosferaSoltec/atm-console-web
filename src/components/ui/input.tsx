import type { InputProps } from '@/types/ui.types'
import { cn } from '@/utils/cn'

export function Input({ className, leadingIcon: LeadingIcon, invalid = false, ...props }: InputProps) {
  return (
    <div className="relative">
      {LeadingIcon && <LeadingIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />}
      <input
        aria-invalid={invalid || undefined}
        className={cn(
          'h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500',
          invalid
            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
            : 'border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15',
          LeadingIcon && 'pl-9',
          className,
        )}
        {...props}
      />
    </div>
  )
}
