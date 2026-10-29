import { TriangleAlert } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useDeleteSystem } from '../hooks/useDeleteSystem'
import type { DeleteSystemDialogProps } from '../types/system.types'

export function DeleteSystemDialog({ system, open, onClose, onDeleted }: DeleteSystemDialogProps) {
  const [confirmation, setConfirmation] = useState('')
  const { remove, isDeleting, error, clearError } = useDeleteSystem()

  const canDelete = confirmation === system.code && !isDeleting

  const handleClose = () => {
    setConfirmation('')
    clearError()
    onClose()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canDelete) return
    if (await remove(system.id, confirmation)) onDeleted()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Eliminar sistema"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="delete-system-form" variant="danger" disabled={!canDelete}>
            {isDeleting ? 'Eliminando...' : 'Eliminar sistema'}
          </Button>
        </>
      }
    >
      <form id="delete-system-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>
            Se eliminará <strong>{system.name}</strong> de forma permanente, junto con las empresas que lo tenían habilitado, los accesos de sus
            usuarios y sus sesiones. No se puede deshacer.
          </p>
        </div>
        <FormField label={`Escribe ${system.code} para confirmar`} htmlFor="delete-system-code">
          <Input
            id="delete-system-code"
            className="font-mono"
            placeholder="Ingresa el código del sistema"
            autoComplete="off"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            autoFocus
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
