import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { BadgeTone } from '@/types/ui.types'
import type { ServiceHealth, ServiceStatusListProps } from '../types/dashboard.types'

const HEALTH_LABELS: Record<ServiceHealth, string> = {
  operational: 'Operativo',
  degraded: 'Lento',
  down: 'Caído',
}

const HEALTH_TONES: Record<ServiceHealth, BadgeTone> = {
  operational: 'success',
  degraded: 'warning',
  down: 'danger',
}

export function ServiceStatusList({ services }: ServiceStatusListProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Estado de los servicios</CardTitle>
          <CardDescription>Latencia y disponibilidad de cada API</CardDescription>
        </div>
      </CardHeader>
      <ul className="divide-y divide-slate-100 px-5 pb-2">
        {services.map(({ id, name, description, icon: Icon, health, latencyMs, uptimePercent }) => (
          <li key={id} className="flex items-center gap-3.5 py-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-900">{name}</span>
              <span className="block truncate text-xs text-slate-500">{description}</span>
            </span>
            <span className="hidden text-right text-xs text-slate-500 sm:block">
              <span className="block font-medium text-slate-700">{latencyMs} ms</span>
              <span className="block">{uptimePercent}% uptime</span>
            </span>
            <Badge tone={HEALTH_TONES[health]} className="w-24 justify-center">
              {HEALTH_LABELS[health]}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  )
}
