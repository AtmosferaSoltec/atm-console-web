import { useId } from 'react'
import type { CheckboxProps } from '@/types/ui.types'
import { cn } from '@/utils/cn'

export function Checkbox({ label, description, className, id, ...props }: CheckboxProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <label htmlFor={inputId} className={cn('flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50', className)}>
      <input id={inputId} type="checkbox" className="mt-0.5 size-4 cursor-pointer accent-brand-600" {...props} />
      <span className="min-w-0 leading-tight">
        <span className="block text-sm font-medium text-slate-900">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-slate-500">{description}</span>}
      </span>
    </label>
  )
}
