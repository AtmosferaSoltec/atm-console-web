import { DetailList, ExternalLink } from '@/components/common/DetailList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatMoney } from '@/utils/format'
import type { InvoiceDetailProps } from '../types/document.types'

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const link = invoice.status === 'PENDING' ? null : '#'

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Comprobante</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailList
            items={[
              { label: 'Cliente', value: invoice.clientName },
              { label: 'Documento', value: invoice.clientDocument },
              { label: 'Total', value: formatMoney(invoice.total, invoice.currency) },
              { label: 'Referencia externa', value: invoice.externalReference },
              { label: 'Emitido', value: invoice.createdAt },
              { label: 'Actualizado', value: invoice.updatedAt },
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
              { label: 'CDR', value: <ExternalLink href={invoice.status === 'ACCEPTED' ? '#' : null}>Descargar CDR</ExternalLink> },
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
              { label: 'Descripción', value: invoice.sunatDescription },
              { label: 'Código', value: invoice.sunatCode || '—' },
              { label: 'Verificaciones', value: invoice.sunatChecks },
              { label: 'Última verificación', value: invoice.lastSunatCheck },
            ]}
          />
        </CardContent>
      </Card>

      {invoice.voidReason && (
        <Card>
          <CardHeader>
            <CardTitle>Anulación</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList items={[{ label: 'Motivo', value: invoice.voidReason }, { label: 'Anulado', value: invoice.updatedAt }]} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
