import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useSaveClient } from '../hooks/useSaveClient'
import type { ClientDialogProps } from '../types/client.types'

function ClientForm({ client, onClose, onSaved }: Omit<ClientDialogProps, 'open'>) {
  const [name, setName] = useState(client?.name ?? '')
  const { save, isSaving, error, clearError } = useSaveClient()
  const canSubmit = name.trim() !== '' && !isSaving

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    if (await save(name.trim(), client?.id)) {
      onSaved()
      onClose()
    }
  }

  return (
    <Dialog
      open
      onClose={isSaving ? () => undefined : onClose}
      title={client ? 'Renombrar cliente' : 'Nuevo cliente'}
      description="El cliente es el dueño real: puede tener varias empresas y los sistemas pueden compartir datos entre ellas."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="client-form" disabled={!canSubmit}>
            {isSaving ? 'Guardando...' : client ? 'Guardar cambios' : 'Crear cliente'}
          </Button>
        </>
      }
    >
      <form id="client-form" onSubmit={handleSubmit} onChange={clearError} className="space-y-4">
        <FormField label="Nombre" htmlFor="client-name" hint="Como llamas a esta persona o negocio.">
          <Input id="client-name" placeholder="Ingresa el nombre del cliente" maxLength={200} value={name} onChange={(event) => setName(event.target.value)} autoFocus />
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

export function ClientDialog({ open, client, onClose, onSaved }: ClientDialogProps) {
  if (!open) return null
  // Keyed so the form starts fresh each time the dialog opens or switches client.
  return <ClientForm key={client?.id ?? 'new'} client={client} onClose={onClose} onSaved={onSaved} />
}
