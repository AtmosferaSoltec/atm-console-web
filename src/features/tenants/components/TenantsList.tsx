import { useMemo, useState } from 'react'
import { ListToolbar } from '@/components/common/ListToolbar'
import { TableFooter } from '@/components/common/TableFooter'
import { Card } from '@/components/ui/card'
import type { TenantItem, TenantsListProps } from '../types/tenant.types'
import { EditTenantDialog } from './EditTenantDialog'
import { TenantSystemsDialog } from './TenantSystemsDialog'
import { TenantsTable } from './TenantsTable'


function emptyMessage(isLoading: boolean, error: string | null, total: number): string {
  if (isLoading) return 'Cargando empresas...'
  if (error) return error
  return total === 0 ? 'Todavía no hay empresas.' : 'No hay empresas con esos filtros.'
}

export function TenantsList({ tenants, isLoading, error, onChanged }: TenantsListProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [managingId, setManagingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  // Looked up in the list so the dialog sees the fresh systems after a reload.
  const managing = tenants.find((tenant) => tenant.id === managingId) ?? null
  const editing = tenants.find((tenant) => tenant.id === editingId) ?? null

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return tenants.filter(
      (tenant) =>
        (status === 'all' || tenant.status === status) &&
        (term === '' || tenant.legalName.toLowerCase().includes(term) ||
          tenant.tradeName.toLowerCase().includes(term) || tenant.ruc.includes(term)),
    )
  }, [tenants, search, status])

  return (
    <Card>
      <ListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar por razón social o RUC" status={status} onStatusChange={setStatus} />
      <div className="border-t border-slate-100">
        <TenantsTable tenants={visible} emptyMessage={emptyMessage(isLoading, error, tenants.length)} onEdit={(tenant: TenantItem) => setEditingId(tenant.id)} onManageSystems={(tenant: TenantItem) => setManagingId(tenant.id)} />
      </div>
      <TableFooter shown={visible.length} total={tenants.length} noun="empresas" />
      <EditTenantDialog tenant={editing} onClose={() => setEditingId(null)} onSaved={onChanged} />
      <TenantSystemsDialog tenant={managing} onClose={() => setManagingId(null)} onSaved={onChanged} />
    </Card>
  )
}
