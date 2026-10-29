import { Link } from 'react-router-dom'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { ROUTES } from '@/config/routes'
import type { CompanyFormProps } from '../types/company.types'

export function CompanyForm({ onSubmit }: CompanyFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className="grid gap-6 lg:grid-cols-2"
    >
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Datos de la empresa</CardTitle>
            <CardDescription>El RUC no se puede cambiar después.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="RUC" htmlFor="company-ruc">
            <Input id="company-ruc" inputMode="numeric" maxLength={11} placeholder="20123456789" className="font-mono" />
          </FormField>
          <FormField label="Razón social" htmlFor="company-name">
            <Input id="company-name" placeholder="Mi Empresa S.A.C." />
          </FormField>
          <FormField label="Límite mensual de documentos" htmlFor="company-limit" hint="Lo que permite su plan de Nubefact al mes.">
            <Input id="company-limit" type="number" min={1} defaultValue={500} />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Cuenta de Nubefact</CardTitle>
            <CardDescription>Si la dejas vacía, la empresa empieza en la cuenta de pruebas.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="URL" htmlFor="company-url">
            <Input id="company-url" type="url" placeholder="https://api.nubefact.com/api/v1/…" />
          </FormField>
          <FormField label="Token" htmlFor="company-token" hint="Se guarda cifrado y nunca se muestra completo.">
            <PasswordInput id="company-token" autoComplete="off" />
          </FormField>
          <FormField label="Email de Nubefact (opcional)" htmlFor="company-email">
            <Input id="company-email" type="email" placeholder="facturacion@empresa.pe" />
          </FormField>
        </CardContent>
      </Card>

      <div className="flex gap-2 lg:col-span-2">
        <Button type="submit">Crear empresa</Button>
        <Link to={ROUTES.billing.companies} className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-slate-600 hover:bg-slate-100">
          Cancelar
        </Link>
      </div>
    </form>
  )
}
