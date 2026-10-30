import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CompanyLogoField, deleteFile } from '@/features/storage'
import { useUpdateTenant } from '../hooks/useUpdateTenant'
import type { EditTenantDialogProps, EditTenantFormProps } from '../types/tenant.types'

const UBIGEO_LENGTH = 6

/** The logo file is already uploaded when it is chosen, so a discarded or replaced one has to be removed from storage. */
function discardFile(fileId: string): void {
  if (fileId) void deleteFile(fileId).catch(() => undefined)
}

function EditTenantForm({ tenant, onClose, onSaved }: EditTenantFormProps) {
  const [legalName, setLegalName] = useState(tenant.legalName)
  const [tradeName, setTradeName] = useState(tenant.tradeName)
  const [address, setAddress] = useState(tenant.address)
  const [department, setDepartment] = useState(tenant.department)
  const [province, setProvince] = useState(tenant.province)
  const [district, setDistrict] = useState(tenant.district)
  const [ubigeo, setUbigeo] = useState(tenant.ubigeo)
  const [phone, setPhone] = useState(tenant.phone)
  const [email, setEmail] = useState(tenant.email)
  const [logoFileId, setLogoFileId] = useState(tenant.logoFileId)
  const { save, isSaving, error, clearError } = useUpdateTenant()

  const ubigeoValid = ubigeo === '' || ubigeo.length === UBIGEO_LENGTH
  const canSubmit = legalName.trim() !== '' && ubigeoValid && !isSaving

  const handleClose = () => {
    if (isSaving) return
    // A logo uploaded in this dialog and never saved would stay in storage forever.
    if (logoFileId !== tenant.logoFileId) discardFile(logoFileId)
    onClose()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    const saved = await save(tenant.id, {
      legalName: legalName.trim(),
      tradeName: tradeName.trim(),
      address: address.trim(),
      department: department.trim(),
      province: province.trim(),
      district: district.trim(),
      ubigeo,
      phone: phone.trim(),
      email: email.trim(),
      logoFileId,
    })
    if (!saved) return
    // Only after the new reference is saved is it safe to remove the previous file.
    if (logoFileId !== tenant.logoFileId) discardFile(tenant.logoFileId)
    onSaved()
    onClose()
  }

  return (
    <Dialog
      open
      onClose={handleClose}
      size="lg"
      title="Datos de la empresa"
      description={`RUC ${tenant.ruc}. Todo es opcional salvo la razón social. Los sistemas leen estos datos desde aquí.`}
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-tenant-form" disabled={!canSubmit}>
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </>
      }
    >
      <form id="edit-tenant-form" onSubmit={handleSubmit} onChange={clearError} className="space-y-4">
        <FormField label="Logo" htmlFor="tenant-logo" hint="PNG o JPEG de hasta 2 MB. Se comparte entre todos los sistemas.">
          <CompanyLogoField companyId={tenant.id} logoFileId={logoFileId} onChange={setLogoFileId} disabled={isSaving} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Razón social" htmlFor="tenant-legal-name">
            <Input id="tenant-legal-name" value={legalName} maxLength={200} onChange={(event) => setLegalName(event.target.value)} />
          </FormField>
          <FormField label="Nombre comercial" htmlFor="tenant-trade-name">
            <Input id="tenant-trade-name" value={tradeName} maxLength={200} onChange={(event) => setTradeName(event.target.value)} />
          </FormField>
        </div>
        <FormField label="Dirección" htmlFor="tenant-address" hint="La que se imprime en los comprobantes.">
          <Input id="tenant-address" value={address} maxLength={255} onChange={(event) => setAddress(event.target.value)} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Departamento" htmlFor="tenant-department">
            <Input id="tenant-department" value={department} maxLength={60} onChange={(event) => setDepartment(event.target.value)} />
          </FormField>
          <FormField label="Provincia" htmlFor="tenant-province">
            <Input id="tenant-province" value={province} maxLength={60} onChange={(event) => setProvince(event.target.value)} />
          </FormField>
          <FormField label="Distrito" htmlFor="tenant-district">
            <Input id="tenant-district" value={district} maxLength={60} onChange={(event) => setDistrict(event.target.value)} />
          </FormField>
        </div>
        <FormField label="Ubigeo" htmlFor="tenant-ubigeo" error={ubigeoValid ? undefined : 'El ubigeo debe tener 6 dígitos.'} hint="Código INEI del distrito. SUNAT lo exige en las guías.">
          <Input
            id="tenant-ubigeo"
            inputMode="numeric"
            value={ubigeo}
            maxLength={UBIGEO_LENGTH}
            invalid={!ubigeoValid}
            onChange={(event) => setUbigeo(event.target.value.replace(/\D/g, ''))}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Teléfono" htmlFor="tenant-phone">
            <Input id="tenant-phone" inputMode="tel" value={phone} maxLength={20} onChange={(event) => setPhone(event.target.value)} />
          </FormField>
          <FormField label="Correo" htmlFor="tenant-email">
            <Input id="tenant-email" type="email" value={email} maxLength={160} onChange={(event) => setEmail(event.target.value)} />
          </FormField>
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  )
}

export function EditTenantDialog({ tenant, onClose, onSaved }: EditTenantDialogProps) {
  // The form mounts only with a company, so its fields start from that company's data every time.
  return tenant ? <EditTenantForm key={tenant.id} tenant={tenant} onClose={onClose} onSaved={onSaved} /> : null
}
