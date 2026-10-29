import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { TableFooter } from '@/components/common/TableFooter'
import { Card } from '@/components/ui/card'
import { DocumentFilters, EMPTY_DOCUMENT_FILTERS, InvoicesTable, useInvoices } from '@/features/documents'
import type { DocumentFiltersValue } from '@/features/documents'

export function InvoicesPage() {
  const [filters, setFilters] = useState<DocumentFiltersValue>(EMPTY_DOCUMENT_FILTERS)
  const invoices = useInvoices(filters)

  return (
    <>
      <PageHeader title="Comprobantes" description="Facturas y boletas emitidas por todas las empresas." />
      <Card>
        <DocumentFilters kind="invoices" value={filters} onChange={setFilters} />
        <InvoicesTable invoices={invoices} />
        <TableFooter shown={invoices.length} total={invoices.length} noun="comprobantes" />
      </Card>
    </>
  )
}
