import { Link } from 'react-router-dom'
import { EmptyRow } from '@/components/common/EmptyRow'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { DOCUMENT_TYPE_LABELS } from '@/config/labels'
import { shippingGuidePath } from '@/config/routes'
import { TestBadge } from '@/features/companies'
import { formatDocumentNumber } from '@/utils/format'
import type { GuidesTableProps } from '../types/document.types'
import { DocumentStatusBadge } from './DocumentStatusBadge'

export function GuidesTable({ guides, emptyMessage = 'No hay guías con esos filtros.' }: GuidesTableProps) {
  return (
    <Table className="min-w-[960px]">
      <THead>
        <Tr>
          <Th>Número</Th>
          <Th>Tipo</Th>
          <Th>Empresa</Th>
          <Th>Cliente</Th>
          <Th>Destinatario</Th>
          <Th>Traslado</Th>
          <Th>Estado</Th>
        </Tr>
      </THead>
      <TBody>
        {guides.length === 0 && <EmptyRow colSpan={7} message={emptyMessage} />}
        {guides.map((guide) => (
          <Tr key={guide.id}>
            <Td className="whitespace-nowrap">
              <span className="inline-flex items-center gap-2">
                <Link to={shippingGuidePath(guide.id)} className="font-mono font-medium text-slate-900 hover:text-brand-700">
                  {formatDocumentNumber(guide.series, guide.number)}
                </Link>
                {guide.isTest && <TestBadge />}
              </span>
            </Td>
            <Td>{DOCUMENT_TYPE_LABELS[guide.documentType]}</Td>
            <Td className="max-w-48 truncate">{guide.companyName}</Td>
            <Td className="max-w-56">
              <span className="block truncate">{guide.clientName}</span>
              <span className="block font-mono text-xs text-slate-500">{guide.clientDocument}</span>
            </Td>
            <Td className="max-w-48 truncate">{guide.recipient ?? '—'}</Td>
            <Td className="whitespace-nowrap text-slate-500">{guide.transferDate}</Td>
            <Td>
              <DocumentStatusBadge status={guide.status} />
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
