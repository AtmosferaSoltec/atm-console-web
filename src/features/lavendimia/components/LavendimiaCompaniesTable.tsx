import { EmptyRow } from '@/components/common/EmptyRow'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { CompanyLogo } from '@/features/storage'
import type { LavendimiaCompaniesTableProps } from '../types/lavendimia.types'
import { LavendimiaBillingSwitch } from './LavendimiaBillingSwitch'

export function LavendimiaCompaniesTable({ companies, emptyMessage, billing, onBillingChanged }: LavendimiaCompaniesTableProps) {
  return (
    <Table className="min-w-[640px]">
      <THead>
        <Tr>
          <Th>Empresa</Th>
          <Th>RUC</Th>
          <Th>Cliente</Th>
          <Th>Facturación electrónica</Th>
          <Th>Estado</Th>
        </Tr>
      </THead>
      <TBody>
        {companies.length === 0 && <EmptyRow colSpan={5} message={emptyMessage} />}
        {companies.map((company) => (
          <Tr key={company.id}>
            <Td>
              <span className="flex items-center gap-3">
                <CompanyLogo fileId={company.logoFileId} name={company.displayName} />
                <span className="min-w-0">
                  <span className="block font-medium text-slate-900">{company.displayName}</span>
                  {company.tradeName && <span className="block text-xs text-slate-500">{company.legalName}</span>}
                </span>
              </span>
            </Td>
            <Td className="font-mono text-slate-600">{company.ruc || <span className="text-slate-400">Sin RUC</span>}</Td>
            <Td className="text-slate-600">{company.clientName}</Td>
            <Td>
              {company.ruc ? <LavendimiaBillingSwitch access={billing[company.ruc]} onChanged={onBillingChanged} /> : <span className="text-slate-400">Sin RUC</span>}
            </Td>
            <Td>
              <StatusBadge status={company.status} />
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
