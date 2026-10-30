import { Building2, Pencil, Plus, Trash2, UserMinus, UserPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { roleLabel } from '../services/roleLabels'
import type { GymPanelProps } from '../types/pulso.types'
import { GymColorField } from './GymColorField'

export function GymPanel({ gym, tenant, members, onEditCompany, onAddBranch, onEditBranch, onDeleteBranch, onAddMember, onRemoveMember, onChanged }: GymPanelProps) {
  return (
    <div className="border-b border-slate-100 px-5 py-4 last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">{gym.name}</p>
          {gym.ruc && <p className="text-xs text-slate-500">RUC {gym.ruc}</p>}
        </div>
        <div className="flex items-center gap-1">
          <GymColorField key={gym.brandColor} gym={gym} onSaved={onChanged} />
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Datos de la empresa de ${gym.name}`}
            title="Datos de la empresa (nombre, logo)"
            disabled={!tenant}
            onClick={() => tenant && onEditCompany(tenant)}
          >
            <Building2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Sedes</h3>
            <Button variant="ghost" size="icon" aria-label={`Agregar sede a ${gym.name}`} title="Agregar sede" onClick={() => onAddBranch(gym)}>
              <Plus className="size-4" />
            </Button>
          </div>
          <ul className="divide-y divide-slate-100">
            {gym.branches.length === 0 && <li className="py-2 text-sm text-slate-400">Sin sedes.</li>}
            {gym.branches.map((branch) => (
              <li key={branch.id} className="flex items-center justify-between gap-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-800">{branch.name}</p>
                  {branch.address && <p className="truncate text-xs text-slate-500">{branch.address}</p>}
                </div>
                <span className="flex gap-1">
                  <Button variant="ghost" size="icon" aria-label={`Editar ${branch.name}`} title="Editar" onClick={() => onEditBranch(branch)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label={`Eliminar ${branch.name}`} title="Eliminar" onClick={() => onDeleteBranch(branch)}>
                    <Trash2 className="size-4" />
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Equipo</h3>
            <Button variant="ghost" size="icon" aria-label={`Agregar persona a ${gym.name}`} title="Agregar persona" onClick={() => onAddMember(gym)}>
              <UserPlus className="size-4" />
            </Button>
          </div>
          <ul className="divide-y divide-slate-100">
            {members.length === 0 && <li className="py-2 text-sm text-slate-400">Sin personas con acceso.</li>}
            {members.map((member) => (
              <li key={member.id} className="flex items-center justify-between gap-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-800">{member.userName}</p>
                  <p className="font-mono text-xs text-slate-500">{member.userDni}</p>
                </div>
                <span className="flex items-center gap-2">
                  <Badge tone={member.role === 'admin' ? 'info' : 'neutral'} dot={false}>
                    {roleLabel(member.role)}
                  </Badge>
                  <Button variant="ghost" size="icon" aria-label={`Quitar acceso a ${member.userName}`} title="Quitar acceso" onClick={() => onRemoveMember(member)}>
                    <UserMinus className="size-4" />
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
