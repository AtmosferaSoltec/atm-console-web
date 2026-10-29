import { IdCard } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCreateUser } from '../hooks/useCreateUser'
import type { CreateUserDialogProps } from '../types/user.types'

export function CreateUserDialog({ open, onClose, onCreated }: CreateUserDialogProps) {
  const [dni, setDni] = useState('')
  const [fullName, setFullName] = useState('')
  const { create, isSaving, error, clearError } = useCreateUser()

  const canSubmit = dni.length === 8 && fullName.trim() !== '' && !isSaving

  const handleClose = () => {
    setDni('')
    setFullName('')
    clearError()
    onClose()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    if (await create({ dni, fullName: fullName.trim() })) {
      onCreated()
      handleClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Nuevo usuario"
      description="Una cuenta por persona, identificada por su DNI. Su contraseña inicial es su mismo DNI y debe cambiarla en su primer ingreso."
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="create-user-form" disabled={!canSubmit}>
            {isSaving ? 'Creando...' : 'Crear usuario'}
          </Button>
        </>
      }
    >
      <form id="create-user-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="DNI" htmlFor="user-dni" hint="8 dígitos.">
          <Input
            id="user-dni"
            inputMode="numeric"
            maxLength={8}
            placeholder="Ingresa el DNI"
            leadingIcon={IdCard}
            className="font-mono"
            value={dni}
            onChange={(event) => setDni(event.target.value.replace(/\D/g, ''))}
            autoFocus
          />
        </FormField>
        <FormField label="Nombre completo" htmlFor="user-full-name">
          <Input id="user-full-name" placeholder="Ingresa nombres y apellidos" value={fullName} onChange={(event) => setFullName(event.target.value)} />
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
