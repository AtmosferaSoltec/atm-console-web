import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { TableFooter } from '@/components/common/TableFooter'
import { Card } from '@/components/ui/card'
import { DocumentFilters, EMPTY_DOCUMENT_FILTERS, GuidesTable, useGuides } from '@/features/documents'
import type { DocumentFiltersValue } from '@/features/documents'

export function ShippingGuidesPage() {
  const [filters, setFilters] = useState<DocumentFiltersValue>(EMPTY_DOCUMENT_FILTERS)
  const guides = useGuides(filters)

  return (
    <>
      <PageHeader title="Guías de remisión" description="GRE Remitente y GRE Transportista." />
      <Card>
        <DocumentFilters kind="guides" value={filters} onChange={setFilters} />
        <GuidesTable guides={guides} />
        <TableFooter shown={guides.length} total={guides.length} noun="guías" />
      </Card>
    </>
  )
}
