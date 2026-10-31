import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useClients } from '@/features/clients'
import { useCreateLavendimiaCompany } from '../hooks/useCreateLavendimiaCompany'
import type { NewLavendimiaCompanyDialogProps } from '../types/lavendimia.types'

/** Stands for "no client chosen": the company gets a new client named after it. */
const NEW_CLIENT = 'new'
const RUC_LENGTH = 11

function NewCompanyForm({ systemId, onClose, onCreated }: Omit<NewLavendimiaCompanyDialogProps, 'open' | 'systemId'> & { systemId: string }) {
  const [ruc, setRuc] = useState('')
  const [legalName, setLegalName] = useState('')
  const [tradeName, setTradeName] = useState('')
  const [clientId, setClientId] = useState(NEW_CLIENT)
  const { clients } = useClients()
  const { create, isSaving, error, clearError } = useCreateLavendimiaCompany()

  // La Vendimia bills in the name of the company, so the RUC is not optional here.
  const canSubmit = ruc.length === RUC_LENGTH && legalName.trim() !== '' && !isSaving

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    const created = await create({
      systemId,
      ruc,
      legalName: legalName.trim(),
      tradeName: tradeName.trim(),
      clientId: clientId === NEW_CLIENT ? '' : clientId,
    })
    if (created) {
      onCreated()
      onClose()
    }
  }

  return (
    <Dialog
      open
      onClose={isSaving ? () => undefined : onClose}
      title="Nueva empresa en La Vendimia"
      description="Registra la empresa y le habilita La Vendimia. Después agrega a su administrador desde Usuarios."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="new-lavendimia-company-form" disabled={!canSubmit}>
            {isSaving ? 'Creando...' : 'Crear empresa'}
          </Button>
        </>
      }
    >
      <form id="new-lavendimia-company-form" onSubmit={handleSubmit} onChange={clearError} className="space-y-4">
        <FormField label="RUC" htmlFor="lavendimia-ruc" hint="11 dígitos. La Vendimia emite comprobantes a nombre de este RUC.">
          <Input
            id="lavendimia-ruc"
            inputMode="numeric"
            maxLength={RUC_LENGTH}
            placeholder="Ingresa el RUC"
            className="font-mono"
            value={ruc}
            onChange={(event) => setRuc(event.target.value.replace(/\D/g, ''))}
            autoFocus
          />
        </FormField>
        <FormField label="Razón social" htmlFor="lavendimia-legal-name">
          <Input id="lavendimia-legal-name" placeholder="Ingresa la razón social" value={legalName} onChange={(event) => setLegalName(event.target.value)} />
        </FormField>
        <FormField label="Nombre comercial" htmlFor="lavendimia-trade-name" hint="Opcional. Es el nombre que se muestra en pantalla.">
          <Input id="lavendimia-trade-name" placeholder="Ingresa el nombre comercial" value={tradeName} onChange={(event) => setTradeName(event.target.value)} />
        </FormField>
        <FormField label="Cliente" htmlFor="lavendimia-client" hint="Elige uno existente si ya tiene otras empresas y quieres que compartan compradores.">
          <Select
            id="lavendimia-client"
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

export function NewLavendimiaCompanyDialog({ open, systemId, onClose, onCreated }: NewLavendimiaCompanyDialogProps) {
  if (!open || !systemId) return null
  // Mounted only while open, so the form starts empty every time.
  return <NewCompanyForm systemId={systemId} onClose={onClose} onCreated={onCreated} />
}
