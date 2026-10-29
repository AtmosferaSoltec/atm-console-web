import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { formatNumber } from '@/utils/format'
import type { QueriesBySystemProps } from '../types/identity.types'

export function QueriesBySystem({ systems, monthlyCap }: QueriesBySystemProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Consultas por sistema</CardTitle>
          <CardDescription>Cuánto del tope mensual ha usado cada sistema</CardDescription>
        </div>
      </CardHeader>
      <ul className="space-y-4 p-5">
        {systems.map((system) => (
          <li key={system.id}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-900">{system.name}</span>
              <span className="tabular-nums text-slate-500">{formatNumber(system.queriesThisMonth)}</span>
            </div>
            <ProgressBar value={system.queriesThisMonth} max={monthlyCap} />
          </li>
        ))}
      </ul>
    </Card>
  )
}
