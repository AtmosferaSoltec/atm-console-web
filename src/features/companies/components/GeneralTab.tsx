import { useState, type FormEvent } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCompanyAction } from '../hooks/useCompanyAction'
import { updateCompany } from '../services/companyService'
import type { CompanyTabProps } from '../types/company.types'

export function GeneralTab({ company, onChanged }: CompanyTabProps) {
  const [name, setName] = useState(company.name)
  const [email, setEmail] = useState(company.nubefactEmail ?? '')
  const [limit, setLimit] = useState(String(company.monthlyDocumentLimit))
  const [confirming, setConfirming] = useState(false)
  const save = useCompanyAction()
  const toggle = useCompanyAction()

  const limitValue = Number(limit)
  const limitValid = Number.isInteger(limitValue) && limitValue >= 1
  const dirty = name.trim() !== company.name || email.trim() !== (company.nubefactEmail ?? '') || limitValue !== company.monthlyDocumentLimit
  const canSave = name.trim() !== '' && limitValid && dirty && !save.isBusy

  const handleSave = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSave) return
    const updated = await save.run(() => updateCompany(company.id, { name: name.trim(), nubefactEmail: email.trim(), monthlyDocumentLimit: limitValue }))
    if (updated) onChanged()
  }

  const handleToggle = async () => {
    const updated = await toggle.run(() => updateCompany(company.id, { isActive: !company.isActive }))
    if (updated) {
      setConfirming(false)
      onChanged()
    }
  }

  return (
    <div className="grid gap-6 p-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Datos</CardTitle>
            <CardDescription>El RUC no se puede cambiar.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} onChange={save.clearError} className="space-y-4">
            <FormField label="Razón social" htmlFor="general-name">
              <Input id="general-name" value={name} onChange={(event) => setName(event.target.value)} />
            </FormField>
            <FormField label="Email de Nubefact" htmlFor="general-email">
              <Input id="general-email" type="email" placeholder="(sin email)" value={email} onChange={(event) => setEmail(event.target.value)} />
            </FormField>
            <FormField
              label="Límite mensual de documentos"
              htmlFor="general-limit"
              hint="Facturas, boletas y guías que permite su plan de Nubefact al mes. Solo se usa en la pantalla de consumo."
            >
              <Input id="general-limit" type="number" min={1} value={limit} onChange={(event) => setLimit(event.target.value)} />
            </FormField>
            {save.error && (
              <p role="alert" className="text-sm text-red-600">
                {save.error}
              </p>
            )}
            <Button type="submit" disabled={!canSave}>
              {save.isBusy ? 'Guardando...' : 'Guardar'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <div>
            <CardTitle>Estado</CardTitle>
            <CardDescription>
              {company.isActive ? 'La empresa puede emitir comprobantes y guías.' : 'La empresa está desactivada: sus API keys son rechazadas y no puede emitir.'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant={company.isActive ? 'danger' : 'primary'} onClick={() => setConfirming(true)}>
            {company.isActive ? 'Desactivar empresa' : 'Activar empresa'}
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirming}
        onClose={() => {
          toggle.clearError()
          setConfirming(false)
        }}
        onConfirm={handleToggle}
        title={company.isActive ? '¿Desactivar la empresa?' : '¿Activar la empresa?'}
        description={
          toggle.error ??
          (company.isActive
            ? 'Sus sistemas dejarán de poder emitir de inmediato: todas sus API keys serán rechazadas hasta que la vuelvas a activar.'
            : 'Sus API keys vigentes volverán a funcionar.')
        }
        confirmLabel={company.isActive ? 'Desactivar' : 'Activar'}
        destructive={company.isActive}
      />
    </div>
  )
}
