import { EmptyRow } from '@/components/common/EmptyRow'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import type { SystemTenantsTableProps } from '../types/tenant.types'

/** Tenants that have contracted one system. */
export function SystemTenantsTable({ tenants, isLoading, error }: SystemTenantsTableProps) {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>Empresa</Th>
          <Th>RUC</Th>
        </Tr>
      </THead>
      <TBody>
        {tenants.length === 0 && <EmptyRow colSpan={2} message={isLoading ? 'Cargando empresas...' : (error ?? 'Ninguna empresa tiene este sistema.')} />}
        {tenants.map((tenant) => (
          <Tr key={tenant.id}>
            <Td>
              <span className="block font-medium text-slate-900">{tenant.displayName}</span>
              {tenant.tradeName && <span className="block text-xs text-slate-500">{tenant.legalName}</span>}
            </Td>
            <Td className="font-mono text-slate-600">{tenant.ruc}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
