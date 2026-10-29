import { useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useSampleCredentials } from '../hooks/useApiClients'
import type { CreateApiClientDialogProps } from '../types/apiClient.types'
import { CredentialsDialog } from './CredentialsDialog'

export function CreateApiClientDialog({ open, onClose }: CreateApiClientDialogProps) {
  const [name, setName] = useState('')
  const [created, setCreated] = useState(false)
  const credentials = useSampleCredentials(name.trim() || 'Nuevo sistema')

  const close = () => {
    setCreated(false)
    setName('')
    onClose()
  }

  if (created) return <CredentialsDialog credentials={credentials} heading="Sistema creado" onClose={close} />

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Nuevo sistema"
      description="Una aplicación que enviará mensajes por la API. Recibirá su propia API key y su secreto de webhook."
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button onClick={() => setCreated(true)}>Crear sistema</Button>
        </>
      }
    >
      <FormField label="Nombre del sistema" htmlFor="client-name">
        <Input id="client-name" placeholder="Mi sistema" value={name} onChange={(event) => setName(event.target.value)} />
      </FormField>
    </Dialog>
  )
}
