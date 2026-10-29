import { DetailList, ExternalLink } from '@/components/common/DetailList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GuideDetailProps } from '../types/document.types'

export function GuideDetail({ guide }: GuideDetailProps) {
  const link = guide.status === 'PENDING' ? null : '#'

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
              { label: 'Inicio de traslado', value: guide.transferDate },
              { label: 'Emitida', value: guide.createdAt },
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
              { label: 'Nubefact', value: <ExternalLink href={link}>Ver en Nubefact</ExternalLink> },
              { label: 'PDF', value: <ExternalLink href={link}>Descargar PDF</ExternalLink> },
              { label: 'XML', value: <ExternalLink href={link}>Descargar XML</ExternalLink> },
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
              { label: 'Última verificación', value: guide.lastSunatCheck },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
