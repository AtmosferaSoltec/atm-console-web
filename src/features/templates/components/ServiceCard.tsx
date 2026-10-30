import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DetailList } from '@/components/common/DetailList'
import { formatBytes, formatNumber } from '@/utils/format'
import type { ServiceCardProps } from '../types/template.types'

const ENVIRONMENT_LABELS: Record<string, string> = { production: 'Producción', development: 'Desarrollo' }

const FORMAT_LABELS: Record<string, string> = { a4: 'A4', ticket: 'Ticket' }

export function ServiceCard({ service, limits, systemNames }: ServiceCardProps) {
  const limitItems = limits
    ? [
        ...Object.entries(limits.maxItems).map(([format, max]) => ({ label: `Líneas por documento (${FORMAT_LABELS[format] ?? format})`, value: formatNumber(max) })),
        { label: 'Tamaño del pedido', value: formatBytes(limits.maxBodyBytes) },
        { label: 'Tamaño del logo', value: formatBytes(limits.maxLogoBytes) },
        { label: 'Monto máximo', value: `S/ ${formatNumber(limits.maxAmount)}` },
      ]
    : []

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailList
            items={[
              { label: 'Entorno', value: ENVIRONMENT_LABELS[service.environment] ?? service.environment },
              {
                label: 'Sistemas autorizados',
                value: (
                  <div className="flex flex-wrap gap-1.5">
                    {service.allowedSystems.map((code) => (
                      <Badge key={code} tone="violet" dot={false}>
                        {systemNames[code] ?? code}
                      </Badge>
                    ))}
                  </div>
                ),
              },
              { label: 'Documentos a la vez', value: formatNumber(service.maxConcurrentRenders) },
              { label: 'Tiempo máximo', value: `${service.renderTimeoutSeconds} s` },
            ]}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Límites</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailList items={limitItems} />
        </CardContent>
      </Card>
    </div>
  )
}
