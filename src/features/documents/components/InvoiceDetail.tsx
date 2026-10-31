import { DetailList, ExternalLink } from '@/components/common/DetailList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime, formatMoney } from '@/utils/format'
import type { InvoiceDetailProps } from '../types/document.types'

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
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
              { label: 'Emitido', value: formatDateTime(new Date(invoice.createdAt)) },
              { label: 'Actualizado', value: formatDateTime(new Date(invoice.updatedAt)) },
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
              { label: 'Nubefact', value: <ExternalLink href={invoice.nubefactLink}>Ver en Nubefact</ExternalLink> },
              { label: 'PDF', value: <ExternalLink href={invoice.pdfLink}>Descargar PDF</ExternalLink> },
              { label: 'XML', value: <ExternalLink href={invoice.xmlLink}>Descargar XML</ExternalLink> },
              { label: 'CDR', value: <ExternalLink href={invoice.cdrLink}>Descargar CDR</ExternalLink> },
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
              { label: 'Última verificación', value: invoice.lastSunatCheck ? formatDateTime(new Date(invoice.lastSunatCheck)) : null },
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
            <DetailList items={[{ label: 'Motivo', value: invoice.voidReason }, { label: 'Anulado', value: formatDateTime(new Date(invoice.updatedAt)) }]} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
