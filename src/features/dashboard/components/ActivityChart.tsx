import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatNumber } from '@/utils/format'
import type { ActivityChartProps } from '../types/dashboard.types'

const LABEL_EVERY_HOURS = 4

export function ActivityChart({ activity }: ActivityChartProps) {
  const peak = Math.max(1, ...activity.map((item) => item.messages + item.documents))
  const total = activity.reduce((sum, item) => sum + item.messages + item.documents, 0)

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Actividad de la plataforma</CardTitle>
          <CardDescription>Últimas 24 horas · {formatNumber(total)} eventos</CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-brand-500" /> Mensajes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-ink" /> Comprobantes
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-56 items-end gap-1.5 sm:gap-2">
          {activity.map((item) => {
            const count = item.messages + item.documents
            return (
              <div
                key={item.hour}
                className="group relative flex h-full flex-1 flex-col justify-end"
                title={`${String(item.hour).padStart(2, '0')}:00 · ${item.messages} mensajes, ${item.documents} comprobantes`}
              >
                <div className="flex flex-col justify-end overflow-hidden rounded-t" style={{ height: `${(count / peak) * 100}%` }}>
                  <div className="bg-ink" style={{ height: `${(item.documents / count) * 100}%` }} />
                  <div className="flex-1 bg-brand-500 transition group-hover:bg-brand-600" />
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-2 flex gap-1.5 sm:gap-2">
          {activity.map((item) => (
            <span key={item.hour} className="flex-1 text-center text-[10px] text-slate-400">
              {item.hour % LABEL_EVERY_HOURS === 0 ? String(item.hour).padStart(2, '0') : ''}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
