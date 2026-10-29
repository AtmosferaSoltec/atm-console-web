import { Database, Gauge, Percent, Users } from 'lucide-react'
import { StatCard } from '@/components/common/StatCard'
import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { formatNumber } from '@/utils/format'
import type { IdentityUsageCardsProps } from '../types/identity.types'

export function IdentityUsageCards({ usage }: IdentityUsageCardsProps) {
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-slate-500">Consultas al proveedor este mes</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              {formatNumber(usage.usedThisMonth)} <span className="text-lg font-medium text-slate-400">de {formatNumber(usage.monthlyCap)}</span>
            </p>
          </div>
          <p className="max-w-xs text-right text-xs text-slate-500">
            El servicio se detiene en {formatNumber(usage.monthlyCap)} para dejar margen: el plan gratuito de APIs Peru permite {formatNumber(usage.providerPlanLimit)} al mes.
          </p>
        </div>
        <div className="mt-4">
          <ProgressBar value={usage.usedThisMonth} max={usage.monthlyCap} />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Personas guardadas" value={formatNumber(usage.cachedPersons)} hint="DNI en la base de datos" icon={Users} tone="sky" />
        <StatCard label="Empresas guardadas" value={formatNumber(usage.cachedCompanies)} hint="RUC en la base de datos" icon={Database} tone="violet" />
        <StatCard label="Respuestas desde la base" value={`${usage.cacheHitRate}%`} hint="No gastaron consultas del proveedor" icon={usage.cacheHitRate >= 90 ? Percent : Gauge} />
      </div>
    </div>
  )
}
