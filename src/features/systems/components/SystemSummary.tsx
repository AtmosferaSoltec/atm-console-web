import { CalendarDays } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/utils/format'
import type { SystemSummaryProps } from '../types/system.types'
import { SessionBadge } from './SessionBadge'

export function SystemSummary({ system }: SystemSummaryProps) {
  const facts = [
    { icon: CalendarDays, label: 'Creado', value: formatDate(new Date(system.createdAt)) },
  ]

  return (
    <Card className="mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-lime-brand to-brand-500 text-lg font-semibold text-ink">
          {system.name.charAt(0)}
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{system.name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <p className="font-mono text-sm text-slate-500">{system.code}</p>
            <SessionBadge mode={system.sessionMode} minutes={system.sessionMinutes} />
          </div>
        </div>
      </div>
      <dl className="flex gap-8">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label}>
            <dt className="flex items-center gap-1.5 text-xs text-slate-500">
              <Icon className="size-3.5" />
              {label}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
