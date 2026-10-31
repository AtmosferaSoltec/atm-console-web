import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useClients } from '@/features/clients'
import { usePulsoActions } from '../hooks/usePulsoActions'
import type { NewGymDialogProps } from '../types/pulso.types'

function NewGymForm({ group, systemId, onClose, onSaved }: Omit<NewGymDialogProps, 'group'> & { group: NonNullable<NewGymDialogProps['group']> }) {
  const [name, setName] = useState('')
  const { clients } = useClients()
  // The gym's company belongs to a client of the auth API; by default the one of the group's other gyms.
  const [chosenClientId, setChosenClientId] = useState(group.gyms[0]?.authClientId ?? '')
  const authClientId = chosenClientId || (clients.length === 1 ? clients[0].id : '')
  const { createGym, isBusy, error, clearError } = usePulsoActions()
  const canSubmit = name.trim() !== '' && authClientId !== '' && systemId !== null && !isBusy

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit || !systemId) return
    if (await createGym({ systemId, groupId: group.id, authClientId, name: name.trim() })) {
      onSaved()
      onClose()
    }
  }

  return (
    <Dialog
      open
      onClose={isBusy ? () => undefined : onClose}
      title={`Nuevo gimnasio en ${group.name}`}
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
        <FormField label="Cliente de autenticación" htmlFor="gym-auth-client" hint="Cliente al que pertenece la empresa en el sistema de acceso.">
          <Select
            id="gym-auth-client"
            value={authClientId}
            onValueChange={setChosenClientId}
            placeholder="Selecciona un cliente"
            options={clients.map((item) => ({ value: item.id, label: item.name }))}
          />
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

export function NewGymDialog({ group, ...rest }: NewGymDialogProps) {
  // Mounted only with a group, so the form starts empty every time.
  return group ? <NewGymForm key={group.id} group={group} {...rest} /> : null
}
