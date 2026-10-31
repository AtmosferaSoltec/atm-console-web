import { CalendarDays, FileText, KeyRound } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/utils/format'
import type { CompanySummaryProps } from '../types/company.types'
import { TestBadge } from './TestBadge'

export function CompanySummary({ company }: CompanySummaryProps) {
  const counts = company.counts
  const facts = [
    { icon: FileText, label: 'Documentos del mes', value: counts ? String(counts.invoicesThisMonth + counts.shippingGuidesThisMonth) : '—' },
    { icon: KeyRound, label: 'API keys activas', value: counts ? String(counts.activeApiKeys) : '—' },
    { icon: CalendarDays, label: 'Creada', value: formatDate(new Date(company.createdAt)) },
  ]

  return (
    <Card className="mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{company.name}</h1>
          <StatusBadge status={company.isActive ? 'active' : 'disabled'} />
          {company.isTest && <TestBadge />}
        </div>
        <p className="mt-0.5 font-mono text-sm text-slate-500">RUC {company.ruc}</p>
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
