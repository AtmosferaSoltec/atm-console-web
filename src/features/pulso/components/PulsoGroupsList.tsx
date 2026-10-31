import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EditTenantDialog, useTenants, type TenantItem } from '@/features/tenants'
import { usePulsoActions } from '../hooks/usePulsoActions'
import type { Branch, Gym, PulsoGroup, PulsoGroupsListProps, TeamMember } from '../types/pulso.types'
import { BranchDialog } from './BranchDialog'
import { GroupDialog } from './GroupDialog'
import { GymPanel } from './GymPanel'
import { MemberDialog } from './MemberDialog'
import { MoveGymDialog } from './MoveGymDialog'
import { NewGymDialog } from './NewGymDialog'

type Removal = { kind: 'group'; group: PulsoGroup } | { kind: 'branch'; branch: Branch } | { kind: 'member'; member: TeamMember }

export function PulsoGroupsList({ groups, team, isLoading, error, onChanged, onTeamChanged }: PulsoGroupsListProps) {
  const { tenants, reload: reloadTenants } = useTenants()
  const [newGymFor, setNewGymFor] = useState<PulsoGroup | null>(null)
  const [renamingGroup, setRenamingGroup] = useState<PulsoGroup | null>(null)
  const [movingGym, setMovingGym] = useState<Gym | null>(null)
  const [branchFor, setBranchFor] = useState<Gym | null>(null)
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null)
  const [memberFor, setMemberFor] = useState<Gym | null>(null)
  const [editingCompany, setEditingCompany] = useState<TenantItem | null>(null)
  const [removal, setRemoval] = useState<Removal | null>(null)
  const { remove, removeGroup, removeMember, error: removeError, clearError } = usePulsoActions()
  // Looked up in the list so the dialog sees fresh data after a reload.
  const editingBranch = groups.flatMap((group) => group.gyms).flatMap((gym) => gym.branches).find((branch) => branch.id === editingBranchId) ?? null

  const handleRemove = async () => {
    if (!removal) return
    if (removal.kind === 'group') {
      if (await removeGroup(removal.group.id)) {
        setRemoval(null)
        onChanged()
      }
      return
    }
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

  if (isLoading || error || groups.length === 0) {
    const message = isLoading ? 'Cargando grupos...' : (error ?? 'Todavía no hay grupos. Crea el primero.')
    return (
      <Card>
        <p className="p-6 text-center text-sm text-slate-500">{message}</p>
      </Card>
    )
  }

  const removalText =
    removal?.kind === 'group'
      ? { title: 'Eliminar grupo', description: `Se eliminará el grupo ${removal.group.name}. Solo se puede si no tiene gimnasios.`, confirm: 'Eliminar' }
      : removal?.kind === 'member'
      ? { title: 'Quitar acceso', description: `${removal.member.userName} dejará de entrar a ${removal.member.tenantName} en Pulso. Su cuenta se conserva.`, confirm: 'Quitar' }
      : { title: 'Eliminar sede', description: `Se eliminará la sede ${removal?.branch.name ?? ''}. Esta acción no se puede deshacer.`, confirm: 'Eliminar' }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Card key={group.id}>
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <h2 className="text-base font-semibold text-slate-900">{group.name}</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" aria-label={`Nuevo gimnasio en ${group.name}`} title="Nuevo gimnasio" onClick={() => setNewGymFor(group)}>
                <Plus className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label={`Renombrar ${group.name}`} title="Renombrar grupo" onClick={() => setRenamingGroup(group)}>
                <Pencil className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label={`Eliminar ${group.name}`} title="Eliminar grupo" onClick={() => setRemoval({ kind: 'group', group })}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
          {group.gyms.length === 0 && <p className="px-5 py-4 text-sm text-slate-400">Sin gimnasios.</p>}
          {group.gyms.map((gym) => (
            <GymPanel
              key={gym.id}
              gym={gym}
              tenant={tenants.find((tenant) => tenant.id === gym.tenantId)}
              members={team.members.filter((member) => member.tenantId === gym.tenantId)}
              onEditCompany={setEditingCompany}
              onMoveGym={setMovingGym}
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
      <GroupDialog open={renamingGroup !== null} group={renamingGroup} onClose={() => setRenamingGroup(null)} onSaved={onChanged} />
      <MoveGymDialog gym={movingGym} groups={groups} onClose={() => setMovingGym(null)} onSaved={onChanged} />
      <NewGymDialog group={newGymFor} systemId={team.systemId} onClose={() => setNewGymFor(null)} onSaved={() => { onChanged(); onTeamChanged(); reloadTenants() }} />
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
