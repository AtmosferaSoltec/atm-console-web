import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usePulsoActions } from '../hooks/usePulsoActions'
import type { NewGymDialogProps } from '../types/pulso.types'

function NewGymForm({ client, systemId, onClose, onSaved }: Omit<NewGymDialogProps, 'client'> & { client: NonNullable<NewGymDialogProps['client']> }) {
  const [name, setName] = useState('')
  const { createGym, isBusy, error, clearError } = usePulsoActions()
  const canSubmit = name.trim() !== '' && systemId !== null && !isBusy

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit || !systemId) return
    if (await createGym({ systemId, authClientId: client.authClientId, name: name.trim() })) {
      onSaved()
      onClose()
    }
  }

  return (
    <Dialog
      open
      onClose={isBusy ? () => undefined : onClose}
      title={`Nuevo gimnasio de ${client.name}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isBusy}>
            Cancelar
          </Button>
          <Button type="submit" form="new-gym-form" disabled={!canSubmit}>
            {isBusy ? 'Creando...' : 'Crear gimnasio'}
          </Button>
        </>
      }
    >
      <form id="new-gym-form" onSubmit={handleSubmit} onChange={clearError} className="space-y-4">
        <FormField label="Nombre" htmlFor="gym-name" hint="Se crea con su sede principal. El RUC, logo y demás datos se completan después.">
          <Input id="gym-name" placeholder="Ingresa el nombre del gimnasio" maxLength={200} value={name} onChange={(event) => setName(event.target.value)} autoFocus />
        </FormField>
        {systemId === null && (
          <p role="alert" className="text-sm text-red-600">
            El sistema Pulso no está en el catálogo de autenticación.
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  )
}

export function NewGymDialog({ client, ...rest }: NewGymDialogProps) {
  // Mounted only with a client, so the form starts empty every time.
  return client ? <NewGymForm key={client.id} client={client} {...rest} /> : null
}
