import { useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useMessagingSystems } from '@/features/messaging-systems'
import { useCreateSession } from '../hooks/useSessionActions'
import type { CreateSessionDialogProps } from '../types/session.types'

export function CreateSessionDialog({ open, onClose, onCreated }: CreateSessionDialogProps) {
  const { systems } = useMessagingSystems()
  const create = useCreateSession()
  const [systemCode, setSystemCode] = useState('')
  const [accountRef, setAccountRef] = useState('')

  // Systems that were switched off in messaging cannot get new connections.
  const available = systems.filter((system) => system.tenantId === null || system.isActive)
  const system = available.find((candidate) => candidate.code === systemCode)

  const close = () => {
    setSystemCode('')
    setAccountRef('')
    create.clearError()
    onClose()
  }

  const handleCreate = async () => {
    if (!system || (await create.run(system, accountRef)) === null) return
    onCreated()
    close()
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Nueva conexión"
      description="Crea la conexión de WhatsApp de una empresa. Enseguida podrás generar el link para que su dueño escanee el QR."
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!system || accountRef.trim() === '' || create.isWorking}>
            {create.isWorking ? 'Creando...' : 'Crear conexión'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Sistema" htmlFor="session-client">
          <Select
            id="session-client"
            value={systemCode}
            onValueChange={setSystemCode}
            placeholder="Elige un sistema"
            options={available.map((candidate) => ({ value: candidate.code, label: candidate.name }))}
          />
        </FormField>
        <FormField label="Referencia de la empresa" htmlFor="session-account" hint="El ID o nombre que esa empresa tiene dentro del sistema.">
          <Input id="session-account" placeholder="empresa-001" value={accountRef} onChange={(event) => setAccountRef(event.target.value)} />
        </FormField>
        <FormField label="Canal" htmlFor="session-channel">
          <Select id="session-channel" value="whatsapp" onValueChange={() => undefined} options={[{ value: 'whatsapp', label: 'WhatsApp' }]} />
        </FormField>
        {create.error && <p className="text-sm text-red-600">{create.error}</p>}
      </div>
    </Dialog>
  )
}
