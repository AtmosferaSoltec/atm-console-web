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
import { DocumentStatusBadge, GuideDetail, recheckGuide, useGuide } from '@/features/documents'
import { formatDocumentNumber } from '@/utils/format'

const RECHECKABLE = ['SUBMITTED', 'NEEDS_REVIEW']

export function ShippingGuideDetailPage() {
  const { guideId } = useParams()
  const { guide, isLoading, error, reload } = useGuide(guideId)
  const [rechecking, setRechecking] = useState(false)
  const [recheckError, setRecheckError] = useState<string | null>(null)

  const recheck = async () => {
    if (!guideId) return
    setRechecking(true)
    setRecheckError(null)
    try {
      await recheckGuide(guideId)
      reload()
    } catch (caught) {
      setRecheckError(companyErrorMessage(caught, 'No se pudo reverificar en SUNAT.'))
    } finally {
      setRechecking(false)
    }
  }

  return (
    <>
      <BackLink to={ROUTES.billing.shippingGuides} label="Guías de remisión" />
      {isLoading ? (
        <p className="py-10 text-center text-sm text-slate-500">Cargando guía...</p>
      ) : !guide ? (
        <NotFoundCard message={error ?? 'No encontramos esta guía.'} />
      ) : (
        <>
          <PageHeader
            title={`${DOCUMENT_TYPE_LABELS[guide.documentType]} ${formatDocumentNumber(guide.series, guide.number)}`}
            description={
              <span className="flex flex-wrap items-center gap-2">
                <Link to={companyPath(guide.companyId)} className="hover:text-brand-700">
                  {guide.companyName}
                </Link>
                <DocumentStatusBadge status={guide.status} />
                {guide.isTest && <TestBadge />}
              </span>
            }
            actions={
              RECHECKABLE.includes(guide.status) && (
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
          <GuideDetail guide={guide} />
        </>
      )}
    </>
  )
}
