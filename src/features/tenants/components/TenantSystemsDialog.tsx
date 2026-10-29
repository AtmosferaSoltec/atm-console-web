import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog } from '@/components/ui/dialog'
import { useSystems } from '@/features/systems'
import { useUpdateTenantSystems } from '../hooks/useUpdateTenantSystems'
import type { TenantSystemChange, TenantSystemsDialogProps, TenantSystemsFormProps } from '../types/tenant.types'

function TenantSystemsForm({ tenant, onClose, onSaved }: TenantSystemsFormProps) {
  const { systems, isLoading, error: loadError } = useSystems()
  const [selected, setSelected] = useState<Set<string>>(() => new Set(tenant.systems.map((system) => system.id)))
  const { save, isSaving, error } = useUpdateTenantSystems()

  const enabled = new Set(tenant.systems.map((system) => system.id))
  const changes: TenantSystemChange[] = systems
    .filter((system) => selected.has(system.id) !== enabled.has(system.id))
    .map((system) => ({ systemId: system.id, name: system.name, enable: selected.has(system.id) }))
  const removed = changes.filter((change) => !change.enable)

  const toggle = (systemId: string, checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current)
      if (checked) next.add(systemId)
      else next.delete(systemId)
      return next
    })

  const handleSave = async () => {
    const ok = await save(tenant.id, changes)
    onSaved()
    if (ok) onClose()
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title="Sistemas contratados"
      description={`Marca a qué sistemas puede acceder ${tenant.displayName}.`}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={changes.length === 0 || isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        {isLoading && <p className="text-sm text-slate-500">Cargando sistemas...</p>}
        {loadError && <p className="text-sm text-red-600">{loadError}</p>}
        {!isLoading && !loadError && systems.length === 0 && <p className="text-sm text-slate-500">Todavía no hay sistemas.</p>}
        {systems.map((system) => (
          <Checkbox
            key={system.id}
            label={system.name}
            description={system.code}
            checked={selected.has(system.id)}
            onChange={(event) => toggle(system.id, event.target.checked)}
          />
        ))}
        {removed.length > 0 && (
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <p>
              Quitar {removed.map((change) => change.name).join(', ')} también quita el acceso que los usuarios de esta empresa tenían ahí. Sus
              cuentas se conservan.
            </p>
          </div>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </Dialog>
  )
}

export function TenantSystemsDialog({ tenant, onClose, onSaved }: TenantSystemsDialogProps) {
  // Keyed by tenant so the checks start from that tenant's systems every time the dialog opens.
  return tenant && <TenantSystemsForm key={tenant.id} tenant={tenant} onClose={onClose} onSaved={onSaved} />
}
