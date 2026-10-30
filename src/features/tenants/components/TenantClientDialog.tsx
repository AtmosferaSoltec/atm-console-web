import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { useClients } from '@/features/clients'
import { useChangeTenantClient } from '../hooks/useChangeTenantClient'
import type { TenantClientDialogProps, TenantClientFormProps } from '../types/tenant.types'

function TenantClientForm({ tenant, onClose, onSaved }: TenantClientFormProps) {
  const [clientId, setClientId] = useState(tenant.clientId)
  const { clients, isLoading } = useClients()
  const { change, isSaving, error, clearError } = useChangeTenantClient()

  const canSubmit = clientId !== tenant.clientId && !isLoading && !isSaving

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    if (await change(tenant.id, clientId)) {
      onSaved()
      onClose()
    }
  }

  return (
    <Dialog
      open
      onClose={isSaving ? () => undefined : onClose}
      title="Cambiar de cliente"
      description={`${tenant.displayName} pasa a ser empresa de otro cliente. Si el cliente nuevo ya tiene empresas, los sistemas empiezan a compartir datos entre ellas.`}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="tenant-client-form" disabled={!canSubmit}>
            {isSaving ? 'Guardando...' : 'Guardar cambio'}
          </Button>
        </>
      }
    >
      <form id="tenant-client-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Cliente" htmlFor="tenant-client">
          <Select
            id="tenant-client"
            value={clientId}
            onValueChange={(value) => {
              clearError()
              setClientId(value)
            }}
            options={clients.map((client) => ({ value: client.id, label: client.name }))}
            placeholder={isLoading ? 'Cargando clientes...' : 'Elige el cliente'}
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

export function TenantClientDialog({ tenant, onClose, onSaved }: TenantClientDialogProps) {
  if (!tenant) return null
  // Keyed so the form starts on the current client each time it opens.
  return <TenantClientForm key={tenant.id} tenant={tenant} onClose={onClose} onSaved={onSaved} />
}
