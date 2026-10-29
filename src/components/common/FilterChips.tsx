import type { FilterChipsProps } from '@/types/ui.types'
import { cn } from '@/utils/cn'

export function FilterChips({ options, value, onChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-100 p-4">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition',
              active ? 'bg-ink text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {option.label}
            <span className={cn('ml-1.5 text-xs', active ? 'text-slate-300' : 'text-slate-400')}>{option.count}</span>
          </button>
        )
      })}
    </div>
  )
}
