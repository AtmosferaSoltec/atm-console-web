import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useBranchActions } from '../hooks/useBranchActions'
import type { Branch, Gym, PulsoClientsListProps } from '../types/pulso.types'
import { BranchDialog } from './BranchDialog'

export function PulsoClientsList({ clients, isLoading, error, onChanged }: PulsoClientsListProps) {
  const [creatingFor, setCreatingFor] = useState<Gym | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Branch | null>(null)
  const { remove, error: deleteError, clearError } = useBranchActions()
  // Looked up in the list so the dialog sees fresh data after a reload.
  const editing = clients.flatMap((client) => client.gyms).flatMap((gym) => gym.branches).find((branch) => branch.id === editingId) ?? null

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

  if (isLoading || error || clients.length === 0) {
    const message = isLoading ? 'Cargando clientes...' : (error ?? 'Todavía no hay clientes con Pulso habilitado.')
    return (
      <Card>
        <p className="p-6 text-center text-sm text-slate-500">{message}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <Card key={client.id}>
          <h2 className="border-b border-slate-100 px-5 py-3 text-base font-semibold text-slate-900">{client.name}</h2>
          {client.gyms.length === 0 && <p className="px-5 py-4 text-sm text-slate-400">Sin gimnasios con Pulso habilitado.</p>}
          {client.gyms.map((gym) => (
            <div key={gym.id} className="border-b border-slate-100 px-5 py-4 last:border-b-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">{gym.name}</p>
                  <p className="text-xs text-slate-500">RUC {gym.ruc}</p>
                </div>
                <Button variant="ghost" size="icon" aria-label={`Agregar sede a ${gym.name}`} title="Agregar sede" onClick={() => setCreatingFor(gym)}>
                  <Plus className="size-4" />
                </Button>
              </div>
              <ul className="mt-2 divide-y divide-slate-100">
                {gym.branches.length === 0 && <li className="py-2 text-sm text-slate-400">Sin sedes.</li>}
                {gym.branches.map((branch) => (
                  <li key={branch.id} className="flex items-center justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-slate-800">{branch.name}</p>
                      {branch.address && <p className="truncate text-xs text-slate-500">{branch.address}</p>}
                    </div>
                    <span className="flex gap-1">
                      <Button variant="ghost" size="icon" aria-label={`Editar ${branch.name}`} title="Editar" onClick={() => setEditingId(branch.id)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label={`Eliminar ${branch.name}`} title="Eliminar" onClick={() => setDeleting(branch)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Card>
      ))}
      <BranchDialog open={creatingFor !== null} gym={creatingFor} branch={null} onClose={() => setCreatingFor(null)} onSaved={onChanged} />
      <BranchDialog open={editing !== null} gym={null} branch={editing} onClose={() => setEditingId(null)} onSaved={onChanged} />
      <ConfirmDialog
        open={deleting !== null}
        onClose={closeDelete}
        onConfirm={handleDelete}
        title="Eliminar sede"
        description={deleteError ?? `Se eliminará la sede ${deleting?.name ?? ''}. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        destructive
      />
    </div>
  )
}
