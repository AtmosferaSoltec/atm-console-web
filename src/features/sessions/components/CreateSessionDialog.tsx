import { useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useApiClients } from '@/features/api-clients'
import type { CreateSessionDialogProps } from '../types/session.types'

export function CreateSessionDialog({ open, onClose }: CreateSessionDialogProps) {
  const clients = useApiClients().filter((client) => client.isActive)
  const [clientId, setClientId] = useState('')
  const [accountRef, setAccountRef] = useState('')

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Nueva conexión"
      description="Crea la conexión de WhatsApp de una empresa. Enseguida podrás generar el link para que su dueño escanee el QR."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onClose}>Crear conexión</Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Sistema" htmlFor="session-client">
          <Select id="session-client" value={clientId} onValueChange={setClientId} placeholder="Elige un sistema" options={clients.map((client) => ({ value: client.id, label: client.name }))} />
        </FormField>
        <FormField label="Referencia de la empresa" htmlFor="session-account" hint="El ID o nombre que esa empresa tiene dentro del sistema.">
          <Input id="session-account" placeholder="empresa-001" value={accountRef} onChange={(event) => setAccountRef(event.target.value)} />
        </FormField>
        <FormField label="Canal" htmlFor="session-channel">
          <Select id="session-channel" value="whatsapp" onValueChange={() => undefined} options={[{ value: 'whatsapp', label: 'WhatsApp' }]} />
        </FormField>
      </div>
    </Dialog>
  )
}
