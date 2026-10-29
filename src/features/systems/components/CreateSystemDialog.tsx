import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCreateSystem } from '../hooks/useCreateSystem'
import type { CreateSystemDialogProps, SessionMode } from '../types/system.types'
import { isSessionPolicyValid, SessionPolicyFields } from './SessionPolicyFields'

const CODE_PATTERN = /^[a-z][a-z0-9_-]*$/
const DEFAULT_MINUTES = '30'

export function CreateSystemDialog({ open, onClose, onCreated }: CreateSystemDialogProps) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [sessionMode, setSessionMode] = useState<SessionMode>('persistent')
  const [sessionMinutes, setSessionMinutes] = useState(DEFAULT_MINUTES)
  const { create, isSaving, error, clearError } = useCreateSystem()

  const codeInvalid = code !== '' && !CODE_PATTERN.test(code)
  const canSubmit = name.trim() !== '' && CODE_PATTERN.test(code) && isSessionPolicyValid(sessionMode, sessionMinutes) && !isSaving

  const handleClose = () => {
    setCode('')
    setName('')
    setSessionMode('persistent')
    setSessionMinutes(DEFAULT_MINUTES)
    clearError()
    onClose()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    if (await create({ code, name: name.trim(), session: { mode: sessionMode, minutes: sessionMode === 'temporary' ? Number(sessionMinutes) : 0 } })) {
      onCreated()
      handleClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Nuevo sistema"
      description="Registra un sistema de Atmosfera para poder dar acceso a sus usuarios."
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="create-system-form" disabled={!canSubmit}>
            {isSaving ? 'Creando...' : 'Crear sistema'}
          </Button>
        </>
      }
    >
      <form id="create-system-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nombre" htmlFor="system-name">
          <Input id="system-name" placeholder="Ingresa el nombre" value={name} onChange={(event) => setName(event.target.value)} autoFocus />
        </FormField>
        <FormField
          label="Código"
          htmlFor="system-code"
          hint="Minúsculas, sin espacios. Se usa en los tokens y no se puede cambiar después."
          error={codeInvalid ? 'Debe empezar con una letra.' : undefined}
        >
          <Input
            id="system-code"
            placeholder="Ingresa el código"
            className="font-mono"
            value={code}
            onChange={(event) => setCode(event.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
          />
        </FormField>
        <SessionPolicyFields
          idPrefix="create-system"
          mode={sessionMode}
          minutes={sessionMinutes}
          onModeChange={setSessionMode}
          onMinutesChange={setSessionMinutes}
        />
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  )
}
