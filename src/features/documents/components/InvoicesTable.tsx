import { Link } from 'react-router-dom'
import { EmptyRow } from '@/components/common/EmptyRow'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { DOCUMENT_TYPE_LABELS } from '@/config/labels'
import { invoicePath } from '@/config/routes'
import { formatDocumentNumber, formatMoney } from '@/utils/format'
import type { InvoicesTableProps } from '../types/document.types'
import { DocumentStatusBadge } from './DocumentStatusBadge'
import { TestBadge } from '@/features/companies'

export function InvoicesTable({ invoices, hideCompany = false }: InvoicesTableProps) {
  const columns = hideCompany ? 6 : 7

  return (
    <Table className="min-w-[860px]">
      <THead>
        <Tr>
          <Th>Número</Th>
          <Th>Tipo</Th>
          {!hideCompany && <Th>Empresa</Th>}
          <Th>Cliente</Th>
          <Th className="text-right">Total</Th>
          <Th>Estado</Th>
          <Th>Emitido</Th>
        </Tr>
      </THead>
      <TBody>
        {invoices.length === 0 && <EmptyRow colSpan={columns} message="No hay comprobantes con esos filtros." />}
        {invoices.map((invoice) => (
          <Tr key={invoice.id}>
            <Td className="whitespace-nowrap">
              <span className="inline-flex items-center gap-2">
                <Link to={invoicePath(invoice.id)} className="font-mono font-medium text-slate-900 hover:text-brand-700">
                  {formatDocumentNumber(invoice.series, invoice.number)}
                </Link>
                {invoice.isTest && <TestBadge />}
              </span>
            </Td>
            <Td>{DOCUMENT_TYPE_LABELS[invoice.documentType]}</Td>
            {!hideCompany && <Td className="max-w-48 truncate">{invoice.companyName}</Td>}
            <Td className="max-w-56">
              <span className="block truncate">{invoice.clientName}</span>
              <span className="block font-mono text-xs text-slate-500">{invoice.clientDocument}</span>
            </Td>
            <Td className="text-right font-mono whitespace-nowrap">{formatMoney(invoice.total, invoice.currency)}</Td>
            <Td>
              <DocumentStatusBadge status={invoice.status} />
            </Td>
            <Td className="text-slate-500">{invoice.createdAt}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
