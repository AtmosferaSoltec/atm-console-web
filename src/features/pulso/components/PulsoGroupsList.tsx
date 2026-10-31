import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EditTenantDialog, useTenants, type TenantItem } from '@/features/tenants'
import { usePulsoActions } from '../hooks/usePulsoActions'
import type { Branch, Gym, PulsoClient, PulsoClientsListProps, TeamMember } from '../types/pulso.types'
import { BranchDialog } from './BranchDialog'
import { GymPanel } from './GymPanel'
import { MemberDialog } from './MemberDialog'
import { NewGymDialog } from './NewGymDialog'

type Removal = { kind: 'branch'; branch: Branch } | { kind: 'member'; member: TeamMember }

export function PulsoClientsList({ clients, team, isLoading, error, onChanged, onTeamChanged }: PulsoClientsListProps) {
  const { tenants, reload: reloadTenants } = useTenants()
  const [newGymFor, setNewGymFor] = useState<PulsoClient | null>(null)
  const [branchFor, setBranchFor] = useState<Gym | null>(null)
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null)
  const [memberFor, setMemberFor] = useState<Gym | null>(null)
  const [editingCompany, setEditingCompany] = useState<TenantItem | null>(null)
  const [removal, setRemoval] = useState<Removal | null>(null)
  const { remove, removeMember, error: removeError, clearError } = usePulsoActions()
  // Looked up in the list so the dialog sees fresh data after a reload.
  const editingBranch = clients.flatMap((client) => client.gyms).flatMap((gym) => gym.branches).find((branch) => branch.id === editingBranchId) ?? null

  const handleRemove = async () => {
    if (!removal) return
    if (removal.kind === 'branch') {
      if (await remove(removal.branch.id)) {
        setRemoval(null)
        onChanged()
      }
      return
    }
    if (await removeMember(removal.member.id)) {
      setRemoval(null)
      onTeamChanged()
    }
  }

  const closeRemoval = () => {
    clearError()
    setRemoval(null)
  }

  if (isLoading || error || clients.length === 0) {
    const message = isLoading ? 'Cargando clientes...' : (error ?? 'Todavía no hay clientes. Crea el primero.')
    return (
      <Card>
        <p className="p-6 text-center text-sm text-slate-500">{message}</p>
      </Card>
    )
  }

  const removalText =
    removal?.kind === 'member'
      ? { title: 'Quitar acceso', description: `${removal.member.userName} dejará de entrar a ${removal.member.tenantName} en Pulso. Su cuenta se conserva.`, confirm: 'Quitar' }
      : { title: 'Eliminar sede', description: `Se eliminará la sede ${removal?.branch.name ?? ''}. Esta acción no se puede deshacer.`, confirm: 'Eliminar' }

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <Card key={client.id}>
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <h2 className="text-base font-semibold text-slate-900">{client.name}</h2>
            <Button variant="ghost" size="icon" aria-label={`Nuevo gimnasio de ${client.name}`} title="Nuevo gimnasio" onClick={() => setNewGymFor(client)}>
              <Plus className="size-4" />
            </Button>
          </div>
          {client.gyms.length === 0 && <p className="px-5 py-4 text-sm text-slate-400">Sin gimnasios.</p>}
          {client.gyms.map((gym) => (
            <GymPanel
              key={gym.id}
              gym={gym}
              tenant={tenants.find((tenant) => tenant.id === gym.tenantId)}
              members={team.members.filter((member) => member.tenantId === gym.tenantId)}
              onEditCompany={setEditingCompany}
              onAddBranch={setBranchFor}
              onEditBranch={(branch) => setEditingBranchId(branch.id)}
              onDeleteBranch={(branch) => setRemoval({ kind: 'branch', branch })}
              onAddMember={setMemberFor}
              onRemoveMember={(member) => setRemoval({ kind: 'member', member })}
              onChanged={onChanged}
            />
          ))}
        </Card>
      ))}
      <NewGymDialog client={newGymFor} systemId={team.systemId} onClose={() => setNewGymFor(null)} onSaved={() => { onChanged(); onTeamChanged(); reloadTenants() }} />
      <BranchDialog open={branchFor !== null} gym={branchFor} branch={null} onClose={() => setBranchFor(null)} onSaved={onChanged} />
      <BranchDialog open={editingBranch !== null} gym={null} branch={editingBranch} onClose={() => setEditingBranchId(null)} onSaved={onChanged} />
      <MemberDialog gym={memberFor} systemId={team.systemId} onClose={() => setMemberFor(null)} onSaved={onTeamChanged} />
      <EditTenantDialog tenant={editingCompany} onClose={() => setEditingCompany(null)} onSaved={() => { reloadTenants(); onChanged() }} />
      <ConfirmDialog
        open={removal !== null}
        onClose={closeRemoval}
        onConfirm={handleRemove}
        title={removalText.title}
        description={removeError ?? removalText.description}
        confirmLabel={removalText.confirm}
        destructive
      />
    </div>
  )
}
