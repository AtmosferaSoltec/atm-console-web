import { CalendarDays, IdCard } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/utils/format'
import type { UserSummaryProps } from '../types/user.types'

export function UserSummary({ user }: UserSummaryProps) {
  const facts = [
    { icon: IdCard, label: 'DNI', value: user.dni },
    { icon: CalendarDays, label: 'Creado', value: formatDate(new Date(user.createdAt)) },
  ]

  return (
    <Card className="mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-600">
          {user.fullName.charAt(0)}
        </span>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{user.fullName}</h1>
            <StatusBadge status={user.status} />
          </div>
          <p className="mt-0.5 text-sm text-slate-500">Cuenta global de Atmosfera</p>
        </div>
      </div>
      <dl className="flex gap-8">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label}>
            <dt className="flex items-center gap-1.5 text-xs text-slate-500">
              <Icon className="size-3.5" />
              {label}
            </dt>
            <dd className="mt-0.5 font-mono text-sm font-semibold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
