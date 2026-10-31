import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { PaginationFooter } from '@/components/common/PaginationFooter'
import { Card } from '@/components/ui/card'
import { DocumentFilters, EMPTY_DOCUMENT_FILTERS, InvoicesTable, useInvoices } from '@/features/documents'
import type { DocumentFiltersValue } from '@/features/documents'

export function InvoicesPage() {
  const [filters, setFilters] = useState<DocumentFiltersValue>(EMPTY_DOCUMENT_FILTERS)
  const [pageNumber, setPageNumber] = useState(1)
  const { page, isLoading, error } = useInvoices(filters, pageNumber)

  const from = page.total === 0 ? 0 : (page.page - 1) * page.pageSize + 1
  const to = Math.min(page.page * page.pageSize, page.total)

  return (
    <>
      <PageHeader title="Comprobantes" description="Facturas y boletas emitidas por todas las empresas." />
      <Card>
        <DocumentFilters
          kind="invoices"
          value={filters}
          onChange={(next) => {
            setFilters(next)
            setPageNumber(1)
          }}
        />
        <InvoicesTable invoices={page.items} emptyMessage={isLoading ? 'Cargando comprobantes...' : (error ?? undefined)} />
        <PaginationFooter
          summary={`Mostrando ${from}-${to} de ${page.total} comprobantes`}
          hasPrevious={page.page > 1}
          hasNext={to < page.total}
          onPrevious={() => setPageNumber((current) => current - 1)}
          onNext={() => setPageNumber((current) => current + 1)}
        />
      </Card>
    </>
  )
}
