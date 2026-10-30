import { useMemo, useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ListToolbar } from '@/components/common/ListToolbar'
import { TableFooter } from '@/components/common/TableFooter'
import { Card } from '@/components/ui/card'
import { useDeleteClient } from '../hooks/useDeleteClient'
import type { ClientItem, ClientsListProps } from '../types/client.types'
import { ClientDialog } from './ClientDialog'
import { ClientsTable } from './ClientsTable'

function emptyMessage(isLoading: boolean, error: string | null, total: number): string {
  if (isLoading) return 'Cargando clientes...'
  if (error) return error
  return total === 0 ? 'Todavía no hay clientes.' : 'No hay clientes con esa búsqueda.'
}

export function ClientsList({ clients, isLoading, error, onChanged }: ClientsListProps) {
  const [search, setSearch] = useState('')
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<ClientItem | null>(null)
  const { remove, error: deleteError, clearError } = useDeleteClient()
  // Looked up in the list so the dialog sees the fresh name after a reload.
  const renaming = clients.find((client) => client.id === renamingId) ?? null

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return clients.filter(
      (client) =>
        term === '' ||
        client.name.toLowerCase().includes(term) ||
        client.tenants.some((tenant) => tenant.displayName.toLowerCase().includes(term) || tenant.ruc.includes(term)),
    )
  }, [clients, search])

  const handleDelete = async () => {
    if (!deleting) return
    if (await remove(deleting.id)) {
      setDeleting(null)
      onChanged()
    }
  }

  const closeDelete = () => {
    clearError()
    setDeleting(null)
  }

  return (
    <Card>
      <ListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar por cliente, empresa o RUC" />
      <div className="border-t border-slate-100">
        <ClientsTable
          clients={visible}
          emptyMessage={emptyMessage(isLoading, error, clients.length)}
          onRename={(client) => setRenamingId(client.id)}
          onDelete={setDeleting}
        />
      </div>
      <TableFooter shown={visible.length} total={clients.length} noun="clientes" />
      <ClientDialog open={renaming !== null} client={renaming} onClose={() => setRenamingId(null)} onSaved={onChanged} />
      <ConfirmDialog
        open={deleting !== null}
        onClose={closeDelete}
        onConfirm={handleDelete}
        title="Eliminar cliente"
        description={deleteError ?? `Se eliminará a ${deleting?.name ?? ''}. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        destructive
      />
    </Card>
  )
}
