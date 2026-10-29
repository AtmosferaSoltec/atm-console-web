import { Card } from '@/components/ui/card'
import type { StatCardProps, StatTone } from '@/types/ui.types'
import { cn } from '@/utils/cn'

const TONE_STYLES: Record<StatTone, string> = {
  brand: 'bg-brand-50 text-brand-600',
  sky: 'bg-sky-50 text-sky-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  violet: 'bg-violet-50 text-violet-600',
}

export function StatCard({ label, value, hint, icon: Icon, tone = 'brand' }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={cn('flex size-9 items-center justify-center rounded-lg', TONE_STYLES[tone])}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </Card>
  )
}
