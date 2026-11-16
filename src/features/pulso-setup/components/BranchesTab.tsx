import { Info, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { FormField } from '@/components/common/FormField'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usePulsoActions } from '@/features/pulso'
import type { Branch } from '@/features/pulso'
import type { BranchDialogProps, BranchFormProps, CompanyTabProps } from '../types/pulsoSetup.types'

function BranchForm({ companyId, branch, onClose, onSaved }: BranchFormProps) {
  const [name, setName] = useState(branch?.name ?? '')
  const [address, setAddress] = useState(branch?.address ?? '')
  const { create, update, isBusy, error } = usePulsoActions()

  const save = async () => {
    if (!name.trim()) return
    const input = { name: name.trim(), address: address.trim() }
    if (await (branch ? update(branch.id, input) : create(companyId, input))) {
      onSaved()
      onClose()
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        void save()
      }}
    >
      <FormField label="Nombre" htmlFor="branch-name">
        <Input id="branch-name" value={name} placeholder="Ej. Miraflores" autoFocus onChange={(event) => setName(event.target.value)} />
      </FormField>
      <FormField label="Dirección (opcional)" htmlFor="branch-address" hint="Sale en los recibos de esta sede.">
        <Input id="branch-address" value={address} onChange={(event) => setAddress(event.target.value)} />
      </FormField>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!name.trim() || isBusy}>
          {branch ? 'Guardar' : 'Agregar sede'}
        </Button>
      </div>
    </form>
  )
}

function BranchDialog({ open, companyId, branch, onClose, onSaved }: BranchDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title={branch ? 'Editar sede' : 'Nueva sede'}>
      {open && <BranchForm key={branch?.id ?? 'new'} companyId={companyId} branch={branch} onClose={onClose} onSaved={onSaved} />}
    </Dialog>
  )
}

/** The company's branches. Only the platform adds them: each branch is billed. The first one is the main branch. */
export function BranchesTab({ company, onChanged }: CompanyTabProps) {
  const { remove, error } = usePulsoActions()
  const [editing, setEditing] = useState<Branch | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Branch | null>(null)
  const single = company.branches.length === 1

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          {single
            ? 'Con una sola sede, Pulso no le muestra selector de sedes ni columnas de sede: todo ocurre en esta sede.'
            : `Con ${company.branches.length} sedes, el gimnasio elige en qué sede trabaja y puede filtrar sus reportes por sede.`}
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {company.branches.map((branch, index) => (
          <li key={branch.id} className="flex items-center gap-4 px-5 py-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <MapPin className="size-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
                {branch.name}
                {index === 0 && <Badge dot={false}>Principal</Badge>}
              </p>
              <p className="truncate text-sm text-slate-500">{branch.address || 'Sin dirección'}</p>
            </div>
            <Button variant="ghost" size="icon" aria-label={`Editar ${branch.name}`} onClick={() => setEditing(branch)}>
              <Pencil className="size-4" />
            </Button>
            {!single && (
              <Button variant="danger-ghost" size="icon" aria-label={`Quitar ${branch.name}`} onClick={() => setDeleting(branch)}>
                <Trash2 className="size-4" />
              </Button>
            )}
          </li>
        ))}
      </ul>

      <Button variant="outline" onClick={() => setCreating(true)}>
        <Plus className="size-4" />
        Agregar sede
      </Button>

      <BranchDialog
        open={creating || editing !== null}
        companyId={company.id}
        branch={editing}
        onSaved={onChanged}
        onClose={() => {
          setCreating(false)
          setEditing(null)
        }}
      />
      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          const branch = deleting
          setDeleting(null)
          if (branch) void remove(branch.id).then((ok) => ok && onChanged())
        }}
        title={`¿Quitar la sede ${deleting?.name ?? ''}?`}
        description="Solo se puede quitar una sede sin socios, pagos ni ingresos registrados."
        confirmLabel="Quitar sede"
        destructive
      />
    </div>
  )
}
