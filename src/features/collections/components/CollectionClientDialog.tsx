import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCreateCollectionClient } from '../hooks/useCollectionsActions'
import type { CollectionClientDialogProps } from '../types/collections.types'

const FORM_ID = 'collection-client-form'

/** Asks only for the name. */
export function CollectionClientDialog({ onClose, onCreated }: CollectionClientDialogProps) {
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { run, isWorking, error } = useCreateCollectionClient()
  const nameError = name.trim() === '' ? 'Escribe el nombre del cliente.' : undefined

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (nameError || isWorking) return
    if ((await run(name.trim())) !== null) onCreated()
  }

  return (
    <Dialog
      open
      onClose={isWorking ? () => undefined : onClose}
      title="Nuevo cliente"
      description="Solo el nombre. Después le agregas sus cobros."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isWorking}>
            Cancelar
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isWorking}>
            {isWorking ? 'Agregando...' : 'Agregar cliente'}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="space-y-3">
        <FormField label="Nombre" htmlFor="client-name" error={submitted ? nameError : undefined}>
          <Input id="client-name" value={name} maxLength={120} autoFocus onChange={(event) => setName(event.target.value)} invalid={submitted && !!nameError} />
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
