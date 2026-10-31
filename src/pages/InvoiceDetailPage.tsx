import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BackLink } from '@/components/common/BackLink'
import { NotFoundCard } from '@/components/common/NotFoundCard'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { DOCUMENT_TYPE_LABELS } from '@/config/labels'
import { companyPath, ROUTES } from '@/config/routes'
import { TestBadge } from '@/features/companies'
import { companyErrorMessage } from '@/features/companies'
import { DocumentStatusBadge, InvoiceDetail, recheckInvoice, useInvoice } from '@/features/documents'
import { formatDocumentNumber } from '@/utils/format'

const RECHECKABLE = ['SUBMITTED', 'NEEDS_REVIEW', 'VOID_SUBMITTED']

export function InvoiceDetailPage() {
  const { invoiceId } = useParams()
  const { invoice, isLoading, error, reload } = useInvoice(invoiceId)
  const [rechecking, setRechecking] = useState(false)
  const [recheckError, setRecheckError] = useState<string | null>(null)

  const recheck = async () => {
    if (!invoiceId) return
    setRechecking(true)
    setRecheckError(null)
    try {
      await recheckInvoice(invoiceId)
      reload()
    } catch (caught) {
      setRecheckError(companyErrorMessage(caught, 'No se pudo reverificar en SUNAT.'))
    } finally {
      setRechecking(false)
    }
  }

  return (
    <>
      <BackLink to={ROUTES.billing.invoices} label="Comprobantes" />
      {isLoading ? (
        <p className="py-10 text-center text-sm text-slate-500">Cargando comprobante...</p>
      ) : !invoice ? (
        <NotFoundCard message={error ?? 'No encontramos este comprobante.'} />
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
                <Button variant="outline" onClick={recheck} disabled={rechecking}>
                  <RefreshCw className="size-4" />
                  {rechecking ? 'Reverificando...' : 'Reverificar en SUNAT'}
                </Button>
              )
            }
          />
          {recheckError && (
            <p role="alert" className="mb-4 text-sm text-red-600">
              {recheckError}
            </p>
          )}
          <InvoiceDetail invoice={invoice} />
        </>
      )}
    </>
  )
}
