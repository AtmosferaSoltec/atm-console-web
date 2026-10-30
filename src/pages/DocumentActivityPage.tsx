import { CircleCheck, Clock, RefreshCw, TriangleAlert } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { BreakdownTable, formatLabel, RecentTable, useRenderActivity } from '@/features/render-activity'
import { useSystems } from '@/features/systems'
import { formatDate, formatNumber } from '@/utils/format'

/** Renders take a millisecond or two, so an average of 0 means "under 1 ms", not "no data". */
function averageLabel(rendered: number, avgMs: number): string {
  if (rendered === 0) return '—'
  return avgMs < 1 ? '< 1 ms' : `${formatNumber(avgMs)} ms`
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

export function DocumentActivityPage() {
  const { activity, isLoading, error, reload } = useRenderActivity()
  const { systems } = useSystems()

  const systemNames = Object.fromEntries(systems.map((system) => [system.code, system.name]))
  const failed = activity ? activity.totals.invalid + activity.totals.busy + activity.totals.error : 0
  const emptyMessage = isLoading ? 'Cargando actividad...' : (error ?? 'Todavía no se ha generado ningún documento.')

  return (
    <>
      <PageHeader
        title="Actividad"
        description="Lo que generó el servicio desde su último arranque. No guarda los documentos ni sus datos, así que el conteo vuelve a cero con cada despliegue."
        actions={
          <Button variant="outline" onClick={reload}>
            <RefreshCw className="size-4" />
            Actualizar
          </Button>
        }
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Documentos generados" value={activity ? formatNumber(activity.totals.ok) : '—'} hint="Con PDF entregado" icon={CircleCheck} />
        <StatCard
          label="Con problemas"
          value={activity ? formatNumber(failed) : '—'}
          hint="Rechazados, saturado o con error"
          icon={TriangleAlert}
          tone="amber"
        />
        <StatCard label="Tiempo medio" value={activity ? averageLabel(activity.totals.ok, activity.avgDurationMs) : '—'} hint="Por documento generado" icon={Clock} tone="sky" />
        <StatCard
          label="Contando desde"
          value={activity ? formatDate(activity.since) : '—'}
          hint={activity ? `Último arranque, ${formatClock(activity.since)}` : 'Último arranque del servicio'}
          icon={RefreshCw}
          tone="violet"
        />
      </div>
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Por sistema</CardTitle>
          </CardHeader>
          <BreakdownTable
            rows={activity?.bySystem ?? []}
            nameLabel="Sistema"
            labelFor={(name) => systemNames[name] ?? name}
            emptyMessage={emptyMessage}
          />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Por formato</CardTitle>
          </CardHeader>
          <BreakdownTable rows={activity?.byFormat ?? []} nameLabel="Formato" labelFor={(name) => (name === 'unknown' ? 'Rechazado antes de leerlo' : formatLabel(name))} emptyMessage={emptyMessage} />
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Últimos pedidos</CardTitle>
        </CardHeader>
        <RecentTable events={activity?.recent ?? []} systemNames={systemNames} emptyMessage={emptyMessage} />
      </Card>
    </>
  )
}
