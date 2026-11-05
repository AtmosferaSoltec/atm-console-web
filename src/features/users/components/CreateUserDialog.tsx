import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCreateUser } from '../hooks/useCreateUser'
import { isValidDocument } from '../services/userDocuments'
import type { CreateUserDialogProps, UserDocumentType } from '../types/user.types'
import { DocumentFields } from './DocumentFields'

export function CreateUserDialog({ open, onClose, onCreated }: CreateUserDialogProps) {
  const [documentType, setDocumentType] = useState<UserDocumentType>('dni')
  const [documentNumber, setDocumentNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const { create, isSaving, error, clearError } = useCreateUser()

  const canSubmit = isValidDocument(documentType, documentNumber) && fullName.trim() !== '' && !isSaving

  const handleClose = () => {
    setDocumentType('dni')
    setDocumentNumber('')
    setFullName('')
    clearError()
    onClose()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    if (await create({ documentType, documentNumber, fullName: fullName.trim() })) {
      onCreated()
      handleClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Nuevo usuario"
      description="Una cuenta por persona, identificada por su documento: DNI, carné de extranjería o pasaporte. Su contraseña inicial es el mismo número de documento y debe cambiarla en su primer ingreso."
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
        <DocumentFields
          idPrefix="user"
          documentType={documentType}
          documentNumber={documentNumber}
          onDocumentTypeChange={setDocumentType}
          onDocumentNumberChange={setDocumentNumber}
          autoFocus
        />
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
