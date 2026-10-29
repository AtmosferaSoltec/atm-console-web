import type { ProgressBarProps } from '@/types/ui.types'
import { cn } from '@/utils/cn'

const WARNING_RATIO = 0.8

export function ProgressBar({ value, max }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100))
  const tone = value >= max ? 'bg-red-500' : value >= max * WARNING_RATIO ? 'bg-amber-500' : 'bg-brand-500'

  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={`${value} de ${max}`}
    >
      <div className={cn('h-full rounded-full transition-all', tone)} style={{ width: `${percent}%` }} />
    </div>
  )
}
