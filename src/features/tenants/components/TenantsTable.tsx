import { Pencil, Settings2 } from 'lucide-react'
import { EmptyRow } from '@/components/common/EmptyRow'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { CompanyLogo } from '@/features/storage'
import { formatDate } from '@/utils/format'
import type { TenantsTableProps } from '../types/tenant.types'

export function TenantsTable({ tenants, emptyMessage, onEdit, onManageSystems }: TenantsTableProps) {
  return (
    <Table className="min-w-[820px]">
      <THead>
        <Tr>
          <Th>Empresa</Th>
          <Th>RUC</Th>
          <Th>Sistemas contratados</Th>
          <Th>Estado</Th>
          <Th>Creada</Th>
          <Th className="w-24" />
        </Tr>
      </THead>
      <TBody>
        {tenants.length === 0 && <EmptyRow colSpan={6} message={emptyMessage} />}
        {tenants.map((tenant) => (
          <Tr key={tenant.id}>
            <Td>
              <span className="flex items-center gap-3">
                <CompanyLogo fileId={tenant.logoFileId} name={tenant.displayName} />
                <span className="min-w-0">
                  <span className="block font-medium text-slate-900">{tenant.displayName}</span>
                  {tenant.tradeName && <span className="block text-xs text-slate-500">{tenant.legalName}</span>}
                </span>
              </span>
            </Td>
            <Td className="font-mono text-slate-600">{tenant.ruc}</Td>
            <Td>
              {tenant.systems.length === 0 ? (
                <span className="text-slate-400">Ninguno</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {tenant.systems.map((system) => (
                    <Badge key={system.id} tone="info" dot={false}>
                      {system.name}
                    </Badge>
                  ))}
                </div>
              )}
            </Td>
            <Td>
              <StatusBadge status={tenant.status} />
            </Td>
            <Td className="text-slate-500">{formatDate(new Date(tenant.createdAt))}</Td>
            <Td>
              <span className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" aria-label={`Editar datos de ${tenant.displayName}`} title="Editar datos" onClick={() => onEdit(tenant)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Gestionar sistemas de ${tenant.displayName}`}
                  title="Gestionar sistemas"
                  onClick={() => onManageSystems(tenant)}
                >
                  <Settings2 className="size-4" />
                </Button>
              </span>
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
