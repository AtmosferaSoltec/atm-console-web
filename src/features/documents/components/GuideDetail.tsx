import { DetailList, ExternalLink } from '@/components/common/DetailList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatDateTime } from '@/utils/format'
import type { GuideDetailProps } from '../types/document.types'

export function GuideDetail({ guide }: GuideDetailProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Guía</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailList
            items={[
              { label: 'Cliente', value: guide.clientName },
              { label: 'Documento', value: guide.clientDocument },
              { label: 'Destinatario', value: guide.recipient },
              { label: 'Inicio de traslado', value: formatDate(new Date(`${guide.transferDate}T00:00:00`)) },
              { label: 'Emitida', value: formatDateTime(new Date(guide.createdAt)) },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Archivos</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailList
            items={[
              { label: 'Nubefact', value: <ExternalLink href={guide.nubefactLink}>Ver en Nubefact</ExternalLink> },
              { label: 'PDF', value: <ExternalLink href={guide.pdfLink}>Descargar PDF</ExternalLink> },
              { label: 'XML', value: <ExternalLink href={guide.xmlLink}>Descargar XML</ExternalLink> },
              { label: 'CDR', value: <ExternalLink href={guide.cdrLink}>Descargar CDR</ExternalLink> },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Respuesta SUNAT</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailList
            items={[
              { label: 'Descripción', value: guide.sunatDescription },
              { label: 'Código', value: guide.sunatCode || '—' },
              { label: 'Verificaciones', value: guide.sunatChecks },
              { label: 'Última verificación', value: guide.lastSunatCheck ? formatDateTime(new Date(guide.lastSunatCheck)) : null },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
