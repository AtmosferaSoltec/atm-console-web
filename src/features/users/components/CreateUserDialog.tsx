import { IdCard } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useCreateUser } from '../hooks/useCreateUser'
import type { CreateUserDialogProps } from '../types/user.types'

const MIN_PASSWORD_LENGTH = 8

export function CreateUserDialog({ open, onClose, onCreated }: CreateUserDialogProps) {
  const [dni, setDni] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const { create, isSaving, error, clearError } = useCreateUser()

  const passwordTooShort = password !== '' && password.length < MIN_PASSWORD_LENGTH
  const canSubmit = dni.length === 8 && fullName.trim() !== '' && !passwordTooShort && !isSaving

  const handleClose = () => {
    setDni('')
    setFullName('')
    setPassword('')
    clearError()
    onClose()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    if (await create({ dni, fullName: fullName.trim(), password })) {
      onCreated()
      handleClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Nuevo usuario"
      description="Una cuenta por persona, identificada por su DNI. Después le das acceso a sus sistemas."
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
        <FormField
          label="Contraseña inicial"
          htmlFor="user-password"
          hint="Opcional. Si la dejas vacía, la contraseña es el DNI y deberá cambiarla en su primer ingreso."
          error={passwordTooShort ? 'Mínimo 8 caracteres.' : undefined}
        >
          <PasswordInput id="user-password" placeholder="Ingresa la contraseña (opcional)" value={password} onChange={(event) => setPassword(event.target.value)} />
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
