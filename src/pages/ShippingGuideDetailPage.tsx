import { RefreshCw } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { BackLink } from '@/components/common/BackLink'
import { NotFoundCard } from '@/components/common/NotFoundCard'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { DOCUMENT_TYPE_LABELS } from '@/config/labels'
import { companyPath, ROUTES } from '@/config/routes'
import { TestBadge } from '@/features/companies'
import { DocumentStatusBadge, GuideDetail, useGuide } from '@/features/documents'
import { formatDocumentNumber } from '@/utils/format'

const RECHECKABLE = ['SUBMITTED', 'NEEDS_REVIEW']

export function ShippingGuideDetailPage() {
  const { guideId } = useParams()
  const guide = useGuide(guideId)

  return (
    <>
      <BackLink to={ROUTES.billing.shippingGuides} label="Guías de remisión" />
      {!guide ? (
        <NotFoundCard message="No encontramos esta guía." />
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
                <Button variant="outline">
                  <RefreshCw className="size-4" />
                  Reverificar en SUNAT
                </Button>
              )
            }
          />
          <GuideDetail guide={guide} />
        </>
      )}
    </>
  )
}
