import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Select } from '@/components/ui/select'
import { ROUTES } from '@/config/routes'
import { useCompanyAction } from '../hooks/useCompanyAction'
import { createCompany } from '../services/companyService'
import type { CompanyFormProps, NubefactMode } from '../types/company.types'

const RUC_LENGTH = 11
const MODE_OPTIONS = [
  { value: 'TEST', label: 'Cuenta de pruebas (demo de Nubefact)' },
  { value: 'PRODUCTION', label: 'Cuenta de producción' },
]

export function CompanyForm({ onCreated }: CompanyFormProps) {
  const [ruc, setRuc] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState<NubefactMode>('TEST')
  const [url, setUrl] = useState('')
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const { run, isBusy, error, clearError } = useCompanyAction()

  const canSubmit = ruc.length === RUC_LENGTH && name.trim() !== '' && url.trim() !== '' && token.trim() !== '' && !isBusy

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    const company = await run(() =>
      createCompany({ ruc, name: name.trim(), nubefactUrl: url.trim(), nubefactToken: token.trim(), nubefactMode: mode, nubefactEmail: email.trim() }),
    )
    if (company) onCreated(company)
  }

  return (
    <form onSubmit={handleSubmit} onChange={clearError} className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Datos de la empresa</CardTitle>
            <CardDescription>El RUC no se puede cambiar después.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="RUC" htmlFor="company-ruc">
            <Input
              id="company-ruc"
              inputMode="numeric"
              maxLength={RUC_LENGTH}
              placeholder="20123456789"
              className="font-mono"
              value={ruc}
              onChange={(event) => setRuc(event.target.value.replace(/\D/g, ''))}
            />
          </FormField>
          <FormField label="Razón social" htmlFor="company-name">
            <Input id="company-name" placeholder="Mi Empresa S.A.C." value={name} onChange={(event) => setName(event.target.value)} />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Cuenta de Nubefact</CardTitle>
            <CardDescription>La URL y el token los da Nubefact para la cuenta de la empresa.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Cuenta" htmlFor="company-mode" hint="En pruebas los documentos no valen ante SUNAT. Se puede pasar a producción después, pero no volver.">
            <Select id="company-mode" value={mode} onValueChange={(value) => setMode(value as NubefactMode)} options={MODE_OPTIONS} />
          </FormField>
          <FormField label="URL" htmlFor="company-url">
            <Input id="company-url" type="url" placeholder="https://api.nubefact.com/api/v1/…" value={url} onChange={(event) => setUrl(event.target.value)} />
          </FormField>
          <FormField label="Token" htmlFor="company-token" hint="Se guarda cifrado y nunca se muestra completo.">
            <PasswordInput id="company-token" autoComplete="off" value={token} onChange={(event) => setToken(event.target.value)} />
          </FormField>
          <FormField label="Email de Nubefact (opcional)" htmlFor="company-email">
            <Input id="company-email" type="email" placeholder="facturacion@empresa.pe" value={email} onChange={(event) => setEmail(event.target.value)} />
          </FormField>
        </CardContent>
      </Card>

      {error && (
        <p role="alert" className="text-sm text-red-600 lg:col-span-2">
          {error}
        </p>
      )}
      <div className="flex gap-2 lg:col-span-2">
        <Button type="submit" disabled={!canSubmit}>
          {isBusy ? 'Creando...' : 'Crear empresa'}
        </Button>
        <Link to={ROUTES.billing.companies} className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-slate-600 hover:bg-slate-100">
          Cancelar
        </Link>
      </div>
    </form>
  )
}
