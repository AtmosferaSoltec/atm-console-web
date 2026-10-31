import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usePulsoActions } from '../hooks/usePulsoActions'
import type { GroupDialogProps } from '../types/pulso.types'

function GroupForm({ group, onClose, onSaved }: Omit<GroupDialogProps, 'open'>) {
  const [name, setName] = useState(group?.name ?? '')
  const { saveGroup, isBusy, error, clearError } = usePulsoActions()
  const canSubmit = name.trim() !== '' && !isBusy

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    if (await saveGroup(name.trim(), group?.id)) {
      onSaved()
      onClose()
    }
  }

  return (
    <Dialog
      open
      onClose={isBusy ? () => undefined : onClose}
      title={group ? 'Renombrar grupo' : 'Nuevo grupo'}
      description="El grupo es una etiqueta interna para reunir gimnasios relacionados. Los gimnasios de un mismo grupo no comparten datos."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isBusy}>
            Cancelar
          </Button>
          <Button type="submit" form="group-form" disabled={!canSubmit}>
            {isBusy ? 'Guardando...' : group ? 'Guardar cambios' : 'Crear grupo'}
          </Button>
        </>
      }
    >
      <form id="group-form" onSubmit={handleSubmit} onChange={clearError} className="space-y-4">
        <FormField label="Nombre" htmlFor="group-name">
          <Input id="group-name" placeholder="Ingresa el nombre del grupo" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} autoFocus />
        </FormField>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  )
}

export function GroupDialog({ open, group, onClose, onSaved }: GroupDialogProps) {
  if (!open) return null
  // Keyed so the form starts fresh each time the dialog opens or switches group.
  return <GroupForm key={group?.id ?? 'new'} group={group} onClose={onClose} onSaved={onSaved} />
}
