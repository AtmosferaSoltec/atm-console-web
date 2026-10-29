import { RefreshCw } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { BackLink } from '@/components/common/BackLink'
import { NotFoundCard } from '@/components/common/NotFoundCard'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { DOCUMENT_TYPE_LABELS } from '@/config/labels'
import { companyPath, ROUTES } from '@/config/routes'
import { TestBadge } from '@/features/companies'
import { DocumentStatusBadge, InvoiceDetail, useInvoice } from '@/features/documents'
import { formatDocumentNumber } from '@/utils/format'

const RECHECKABLE = ['SUBMITTED', 'NEEDS_REVIEW', 'VOID_SUBMITTED']

export function InvoiceDetailPage() {
  const { invoiceId } = useParams()
  const invoice = useInvoice(invoiceId)

  return (
    <>
      <BackLink to={ROUTES.billing.invoices} label="Comprobantes" />
      {!invoice ? (
        <NotFoundCard message="No encontramos este comprobante." />
      ) : (
        <>
          <PageHeader
            title={`${DOCUMENT_TYPE_LABELS[invoice.documentType]} ${formatDocumentNumber(invoice.series, invoice.number)}`}
            description={
              <span className="flex flex-wrap items-center gap-2">
                <Link to={companyPath(invoice.companyId)} className="hover:text-brand-700">
                  {invoice.companyName}
                </Link>
                <DocumentStatusBadge status={invoice.status} />
                {invoice.isTest && <TestBadge />}
              </span>
            }
            actions={
              RECHECKABLE.includes(invoice.status) && (
                <Button variant="outline">
                  <RefreshCw className="size-4" />
                  Reverificar en SUNAT
                </Button>
              )
            }
          />
          <InvoiceDetail invoice={invoice} />
        </>
      )}
    </>
  )
}
