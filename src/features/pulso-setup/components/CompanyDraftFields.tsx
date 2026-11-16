import { MapPin, Plus, Trash2, X } from 'lucide-react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { emptyBranch } from '../services/drafts'
import type { CompanyDraftFieldsProps, DraftBranch } from '../types/pulsoSetup.types'

/** Name, RUC and branches of one company being created. */
export function CompanyDraftFields({ draft, index, onChange, onRemove }: CompanyDraftFieldsProps) {
  const prefix = `company-${draft.key}`
  const setBranch = (branch: DraftBranch) => onChange({ ...draft, branches: draft.branches.map((item) => (item.key === branch.key ? branch : item)) })

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 p-4">
      {index !== undefined && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Empresa {index + 1}</p>
          {onRemove && (
            <Button variant="danger-ghost" size="sm" onClick={onRemove}>
              <Trash2 className="size-4" />
              Quitar
            </Button>
          )}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Nombre comercial" htmlFor={`${prefix}-name`} hint="Así lo verán sus socios y su personal.">
          <Input id={`${prefix}-name`} value={draft.tradeName} placeholder="Ej. Iron Gym" onChange={(event) => onChange({ ...draft, tradeName: event.target.value })} />
        </FormField>
        <FormField label="RUC (opcional)" htmlFor={`${prefix}-ruc`} hint="No se puede cambiar después. La razón social y la dirección se completan en General.">
          <Input
            id={`${prefix}-ruc`}
            value={draft.ruc}
            inputMode="numeric"
            maxLength={11}
            placeholder="20XXXXXXXXX"
            onChange={(event) => onChange({ ...draft, ruc: event.target.value.replace(/\D/g, '') })}
          />
        </FormField>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-slate-700">Sedes</p>
        <div className="space-y-2">
          {draft.branches.map((branch, position) => (
            <div key={branch.key} className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  aria-label={`Sede ${position + 1}`}
                  leadingIcon={MapPin}
                  value={branch.name}
                  placeholder="Nombre de la sede"
                  onChange={(event) => setBranch({ ...branch, name: event.target.value })}
                />
              </div>
              {draft.branches.length > 1 && (
                <Button
                  variant="danger-ghost"
                  size="icon"
                  aria-label={`Quitar sede ${position + 1}`}
                  onClick={() => onChange({ ...draft, branches: draft.branches.filter((item) => item.key !== branch.key) })}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => onChange({ ...draft, branches: [...draft.branches, emptyBranch()] })}>
          <Plus className="size-4" />
          Agregar sede
        </Button>
        {draft.branches.length === 1 && <p className="mt-1 text-xs text-slate-500">Con una sola sede, Pulso no muestra selector de sedes al gimnasio.</p>}
      </div>
    </div>
  )
}
