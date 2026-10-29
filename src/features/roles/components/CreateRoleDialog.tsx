import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCreateRole } from '../hooks/useCreateRole'
import type { CreateRoleDialogProps } from '../types/role.types'

export function CreateRoleDialog({ systemId, open, onClose, onCreated }: CreateRoleDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { create, isSaving, error, clearError } = useCreateRole()

  const canSubmit = name.trim() !== '' && !isSaving

  const handleClose = () => {
    setName('')
    setDescription('')
    clearError()
    onClose()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    if (await create(systemId, { name: name.trim(), description: description.trim() })) {
      onCreated()
      handleClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Nuevo rol"
      description="El rol solo identifica al usuario. Lo que puede hacer lo define cada sistema, que lo reconoce por este mismo nombre."
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="create-role-form" disabled={!canSubmit}>
            {isSaving ? 'Creando...' : 'Crear rol'}
          </Button>
        </>
      }
    >
      <form id="create-role-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nombre del rol" htmlFor="role-name" hint="Escríbelo exactamente como lo espera el sistema. No se puede cambiar después.">
          <Input
            id="role-name"
            placeholder="Ingresa el nombre del rol"
            className="font-mono"
            maxLength={64}
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
          />
        </FormField>
        <FormField label="Descripción" htmlFor="role-description" hint="Opcional.">
          <Input
            id="role-description"
            placeholder="Ingresa una descripción"
            maxLength={200}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
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
