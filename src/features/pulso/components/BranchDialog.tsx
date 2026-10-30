import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usePulsoActions } from '../hooks/usePulsoActions'
import type { BranchDialogProps } from '../types/pulso.types'

function BranchForm({ gym, branch, onClose, onSaved }: Omit<BranchDialogProps, 'open'>) {
  const [name, setName] = useState(branch?.name ?? '')
  const [address, setAddress] = useState(branch?.address ?? '')
  const { create, update, isBusy, error, clearError } = usePulsoActions()
  const canSubmit = name.trim() !== '' && !isBusy && (branch !== null || gym !== null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    const input = { name: name.trim(), address: address.trim() }
    const saved = branch ? await update(branch.id, input) : gym ? await create(gym.id, input) : false
    if (saved) {
      onSaved()
      onClose()
    }
  }

  return (
    <Dialog
      open
      onClose={isBusy ? () => undefined : onClose}
      title={branch ? 'Editar sede' : `Nueva sede${gym ? ` de ${gym.name}` : ''}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isBusy}>
            Cancelar
          </Button>
          <Button type="submit" form="branch-form" disabled={!canSubmit}>
            {isBusy ? 'Guardando...' : branch ? 'Guardar cambios' : 'Crear sede'}
          </Button>
        </>
      }
    >
      <form id="branch-form" onSubmit={handleSubmit} onChange={clearError} className="space-y-4">
        <FormField label="Nombre" htmlFor="branch-name">
          <Input id="branch-name" placeholder="Ingresa el nombre de la sede" maxLength={200} value={name} onChange={(event) => setName(event.target.value)} autoFocus />
        </FormField>
        <FormField label="Dirección" htmlFor="branch-address">
          <Input id="branch-address" placeholder="Ingresa la dirección (opcional)" maxLength={300} value={address} onChange={(event) => setAddress(event.target.value)} />
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

export function BranchDialog({ open, gym, branch, onClose, onSaved }: BranchDialogProps) {
  if (!open) return null
  // Keyed so the form starts fresh each time the dialog opens or switches target.
  return <BranchForm key={branch?.id ?? `new-${gym?.id ?? ''}`} gym={gym} branch={branch} onClose={onClose} onSaved={onSaved} />
}
