import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useRoles } from '@/features/roles'
import { usePulsoActions } from '../hooks/usePulsoActions'
import { roleLabel } from '../services/roleLabels'
import type { Gym, MemberDialogProps } from '../types/pulso.types'

const DNI_LENGTH = 8

function MemberForm({ gym, systemId, onClose, onSaved }: Omit<MemberDialogProps, 'gym'> & { gym: Gym }) {
  const [dni, setDni] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('')
  const { addMember, isBusy, error, clearError } = usePulsoActions()
  const { roles } = useRoles(systemId ?? '')
  const canSubmit = dni.length === DNI_LENGTH && fullName.trim() !== '' && role !== '' && systemId !== null && !isBusy

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit || !systemId) return
    if (await addMember({ systemId, tenantId: gym.tenantId, dni, fullName: fullName.trim(), role })) {
      onSaved()
      onClose()
    }
  }

  return (
    <Dialog
      open
      onClose={isBusy ? () => undefined : onClose}
      title={`Agregar persona a ${gym.name}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isBusy}>
            Cancelar
          </Button>
          <Button type="submit" form="member-form" disabled={!canSubmit}>
            {isBusy ? 'Agregando...' : 'Agregar'}
          </Button>
        </>
      }
    >
      <form id="member-form" onSubmit={handleSubmit} onChange={clearError} className="space-y-4">
        <FormField label="DNI" htmlFor="member-dni" hint="Si ya tiene cuenta se usa la que existe. Si no, se crea con el DNI como clave inicial.">
          <Input
            id="member-dni"
            inputMode="numeric"
            maxLength={DNI_LENGTH}
            placeholder="Ingresa el DNI"
            className="font-mono"
            value={dni}
            onChange={(event) => setDni(event.target.value.replace(/\D/g, ''))}
            autoFocus
          />
        </FormField>
        <FormField label="Nombre completo" htmlFor="member-name">
          <Input id="member-name" placeholder="Ingresa el nombre completo" maxLength={200} value={fullName} onChange={(event) => setFullName(event.target.value)} />
        </FormField>
        <FormField label="Rol" htmlFor="member-role" hint="Los administradores pueden crear a su propia recepción.">
          <Select
            id="member-role"
            value={role}
            onValueChange={setRole}
            placeholder="Elige un rol"
            options={roles.map((item) => ({ value: item.name, label: roleLabel(item.name) }))}
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

export function MemberDialog({ gym, ...rest }: MemberDialogProps) {
  // Mounted only with a gym, so the form starts empty every time.
  return gym ? <MemberForm key={gym.id} gym={gym} {...rest} /> : null
}
