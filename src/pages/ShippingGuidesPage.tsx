import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { PaginationFooter } from '@/components/common/PaginationFooter'
import { Card } from '@/components/ui/card'
import { DocumentFilters, EMPTY_DOCUMENT_FILTERS, GuidesTable, useGuides } from '@/features/documents'
import type { DocumentFiltersValue } from '@/features/documents'

export function ShippingGuidesPage() {
  const [filters, setFilters] = useState<DocumentFiltersValue>(EMPTY_DOCUMENT_FILTERS)
  const [pageNumber, setPageNumber] = useState(1)
  const { page, isLoading, error } = useGuides(filters, pageNumber)

  const from = page.total === 0 ? 0 : (page.page - 1) * page.pageSize + 1
  const to = Math.min(page.page * page.pageSize, page.total)

  return (
    <>
      <PageHeader title="Guías de remisión" description="GRE Remitente y GRE Transportista." />
      <Card>
        <DocumentFilters
          kind="guides"
          value={filters}
          onChange={(next) => {
            setFilters(next)
            setPageNumber(1)
          }}
        />
        <GuidesTable guides={page.items} emptyMessage={isLoading ? 'Cargando guías...' : (error ?? undefined)} />
        <PaginationFooter
          summary={`Mostrando ${from}-${to} de ${page.total} guías`}
          hasPrevious={page.page > 1}
          hasNext={to < page.total}
          onPrevious={() => setPageNumber((current) => current - 1)}
          onNext={() => setPageNumber((current) => current + 1)}
        />
      </Card>
    </>
  )
}
