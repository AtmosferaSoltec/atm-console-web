import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useClients } from '@/features/clients'
import { useCreateTenant } from '../hooks/useCreateTenant'
import type { CreateTenantDialogProps } from '../types/tenant.types'

/** Stands for "no client chosen": the company gets a new client named after it. */
const NEW_CLIENT = 'new'

export function CreateTenantDialog({ open, onClose, onCreated }: CreateTenantDialogProps) {
  const [ruc, setRuc] = useState('')
  const [legalName, setLegalName] = useState('')
  const [tradeName, setTradeName] = useState('')
  const [clientId, setClientId] = useState(NEW_CLIENT)
  const { clients } = useClients()
  const { create, isSaving, error, clearError } = useCreateTenant()

  const canSubmit = ruc.length === 11 && legalName.trim() !== '' && !isSaving

  const handleClose = () => {
    setRuc('')
    setLegalName('')
    setTradeName('')
    setClientId(NEW_CLIENT)
    clearError()
    onClose()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    if (await create({ ruc, legalName: legalName.trim(), tradeName: tradeName.trim(), clientId: clientId === NEW_CLIENT ? undefined : clientId })) {
      onCreated()
      handleClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Nueva empresa"
      description="Registra la empresa cliente. Después puedes habilitarle sistemas desde la lista."
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="create-tenant-form" disabled={!canSubmit}>
            {isSaving ? 'Creando...' : 'Crear empresa'}
          </Button>
        </>
      }
    >
      <form id="create-tenant-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="RUC" htmlFor="tenant-ruc" hint="11 dígitos.">
          <Input
            id="tenant-ruc"
            inputMode="numeric"
            maxLength={11}
            placeholder="Ingresa el RUC"
            className="font-mono"
            value={ruc}
            onChange={(event) => setRuc(event.target.value.replace(/\D/g, ''))}
            autoFocus
          />
        </FormField>
        <FormField label="Razón social" htmlFor="tenant-legal-name">
          <Input id="tenant-legal-name" placeholder="Ingresa la razón social" value={legalName} onChange={(event) => setLegalName(event.target.value)} />
        </FormField>
        <FormField label="Nombre comercial" htmlFor="tenant-trade-name" hint="Opcional. Es el nombre que se muestra en pantalla.">
          <Input id="tenant-trade-name" placeholder="Ingresa el nombre comercial" value={tradeName} onChange={(event) => setTradeName(event.target.value)} />
        </FormField>
        <FormField label="Cliente" htmlFor="tenant-client" hint="A quién pertenece la empresa. Elige uno existente si ya tiene otras empresas y quieres que compartan datos.">
          <Select
            id="tenant-client"
            value={clientId}
            onValueChange={setClientId}
            options={[{ value: NEW_CLIENT, label: 'Cliente nuevo, con el nombre de la empresa' }, ...clients.map((client) => ({ value: client.id, label: client.name }))]}
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
