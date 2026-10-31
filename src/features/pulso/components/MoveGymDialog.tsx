import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { usePulsoActions } from '../hooks/usePulsoActions'
import type { Gym, MoveGymDialogProps } from '../types/pulso.types'

function MoveGymForm({ gym, groups, onClose, onSaved }: Omit<MoveGymDialogProps, 'gym'> & { gym: Gym }) {
  const [groupId, setGroupId] = useState(gym.groupId)
  const { moveGym, isBusy, error, clearError } = usePulsoActions()
  const canSubmit = groupId !== gym.groupId && !isBusy

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    if (await moveGym(gym.id, groupId)) {
      onSaved()
      onClose()
    }
  }

  return (
    <Dialog
      open
      onClose={isBusy ? () => undefined : onClose}
      title={`Mover ${gym.name}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isBusy}>
            Cancelar
          </Button>
          <Button type="submit" form="move-gym-form" disabled={!canSubmit}>
            {isBusy ? 'Moviendo...' : 'Mover gimnasio'}
          </Button>
        </>
      }
    >
      <form id="move-gym-form" onSubmit={handleSubmit} onChange={clearError} className="space-y-4">
        <FormField label="Grupo" htmlFor="move-gym-group" hint="Mover un gimnasio no cambia sus socios, sedes ni accesos.">
          <Select
            id="move-gym-group"
            value={groupId}
            onValueChange={(value) => {
              clearError()
              setGroupId(value)
            }}
            options={groups.map((group) => ({ value: group.id, label: group.name }))}
          />
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

export function MoveGymDialog({ gym, ...rest }: MoveGymDialogProps) {
  // Mounted only with a gym, so the selection starts at its current group every time.
  return gym ? <MoveGymForm key={gym.id} gym={gym} {...rest} /> : null
}
