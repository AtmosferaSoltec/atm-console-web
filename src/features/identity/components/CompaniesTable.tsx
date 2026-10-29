import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import type { CompaniesTableProps } from '../types/identity.types'

export function CompaniesTable({ companies }: CompaniesTableProps) {
  return (
    <Table className="min-w-[860px]">
      <THead>
        <Tr>
          <Th>RUC</Th>
          <Th>Razón social</Th>
          <Th>Nombre comercial</Th>
          <Th>Dirección</Th>
          <Th>Guardado</Th>
        </Tr>
      </THead>
      <TBody>
        {companies.map((company) => (
          <Tr key={company.documentNumber}>
            <Td className="font-mono text-slate-900">{company.documentNumber}</Td>
            <Td className="font-medium text-slate-900">{company.legalName}</Td>
            <Td>{company.tradeName ?? <span className="text-slate-400">—</span>}</Td>
            <Td className="max-w-64 truncate">{company.address ?? <span className="text-slate-400">—</span>}</Td>
            <Td className="text-slate-500">{company.storedAt}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
