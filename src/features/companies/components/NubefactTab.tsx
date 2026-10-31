import { CheckCircle2, XCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useCompanyAction } from '../hooks/useCompanyAction'
import { replaceNubefactToken, switchToProduction, testNubefactConnection, updateCompany } from '../services/companyService'
import type { CompanyTabProps, NubefactTestResult } from '../types/company.types'
import { TestBadge } from './TestBadge'

function ErrorLine({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="text-sm text-red-600">
      {message}
    </p>
  )
}

export function NubefactTab({ company, onChanged }: CompanyTabProps) {
  const [url, setUrl] = useState(company.nubefactUrl)
  const [newToken, setNewToken] = useState('')
  const [productionUrl, setProductionUrl] = useState('')
  const [productionToken, setProductionToken] = useState('')
  const [understood, setUnderstood] = useState(false)
  const [result, setResult] = useState<NubefactTestResult | null>(null)
  const urlAction = useCompanyAction()
  const tokenAction = useCompanyAction()
  const productionAction = useCompanyAction()
  const testAction = useCompanyAction()

  const saveUrl = async (event: FormEvent) => {
    event.preventDefault()
    if (url.trim() === '' || url.trim() === company.nubefactUrl) return
    if (await urlAction.run(() => updateCompany(company.id, { nubefactUrl: url.trim() }))) onChanged()
  }

  const replaceToken = async (event: FormEvent) => {
    event.preventDefault()
    if (newToken.trim() === '') return
    if (await tokenAction.run(() => replaceNubefactToken(company.id, newToken.trim()))) {
      setNewToken('')
      onChanged()
    }
  }

  const goToProduction = async (event: FormEvent) => {
    event.preventDefault()
    if (!understood || productionUrl.trim() === '' || productionToken.trim() === '') return
    const done = await productionAction.run(() =>
      switchToProduction(company.id, { nubefactUrl: productionUrl.trim(), nubefactToken: productionToken.trim(), nubefactEmail: company.nubefactEmail ?? '' }),
    )
    if (done) onChanged()
  }

  const test = async () => {
    setResult(null)
    const tested = await testAction.run(() => testNubefactConnection(company.id), 'No se pudo probar la conexión.')
    if (tested) setResult(tested)
  }

  return (
    <div className="grid gap-6 p-5 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        {company.isTest ? (
          <Card className="border-amber-300">
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Cuenta de pruebas <TestBadge />
                </CardTitle>
                <CardDescription>
                  Los documentos van a la cuenta demo de Nubefact: no valen ante SUNAT ni cuentan en el consumo. Para pasar a producción ingresa la URL y el token de la cuenta real.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={goToProduction} onChange={productionAction.clearError} className="space-y-4">
                <FormField label="URL de producción" htmlFor="production-url">
                  <Input id="production-url" type="url" placeholder="https://api.nubefact.com/api/v1/…" value={productionUrl} onChange={(event) => setProductionUrl(event.target.value)} />
                </FormField>
                <FormField label="Token de producción" htmlFor="production-token">
                  <PasswordInput id="production-token" autoComplete="off" value={productionToken} onChange={(event) => setProductionToken(event.target.value)} />
                </FormField>
                <Checkbox
                  label="Entiendo que no se puede volver a pruebas"
                  description="El último número de todas las series vuelve a 0. Si la empresa ya emitía en producción desde otro sistema, sube el último número de cada serie."
                  checked={understood}
                  onChange={(event) => setUnderstood(event.target.checked)}
                />
                <ErrorLine message={productionAction.error} />
                <Button type="submit" disabled={!understood || productionUrl.trim() === '' || productionToken.trim() === '' || productionAction.isBusy}>
                  {productionAction.isBusy ? 'Pasando...' : 'Pasar a producción'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Cuenta de producción</CardTitle>
                <CardDescription>Los documentos se emiten en la cuenta real de Nubefact y se envían a SUNAT.</CardDescription>
              </div>
            </CardHeader>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div>
              <CardTitle>URL</CardTitle>
              <CardDescription>Ruta de la cuenta de la empresa en Nubefact.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveUrl} onChange={urlAction.clearError} className="space-y-4">
              <Input type="url" value={url} onChange={(event) => setUrl(event.target.value)} aria-label="URL de Nubefact" />
              <ErrorLine message={urlAction.error} />
              <Button type="submit" disabled={url.trim() === '' || url.trim() === company.nubefactUrl || urlAction.isBusy}>
                {urlAction.isBusy ? 'Guardando...' : 'Guardar URL'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Token</CardTitle>
              <CardDescription>
                Token actual: <span className="font-mono">{company.nubefactTokenLast4 ? `••••${company.nubefactTokenLast4}` : 'sin token'}</span>. Se guarda cifrado y nunca se muestra completo.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={replaceToken} onChange={tokenAction.clearError} className="space-y-4">
              <FormField label="Nuevo token" htmlFor="new-token">
                <PasswordInput id="new-token" autoComplete="off" value={newToken} onChange={(event) => setNewToken(event.target.value)} />
              </FormField>
              <ErrorLine message={tokenAction.error} />
              <Button type="submit" disabled={newToken.trim() === '' || tokenAction.isBusy}>
                {tokenAction.isBusy ? 'Reemplazando...' : 'Reemplazar token'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <div>
            <CardTitle>Probar conexión</CardTitle>
            <CardDescription>Consulta a Nubefact un comprobante inexistente para verificar la URL y el token guardados. No emite nada.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={test} disabled={testAction.isBusy}>
            {testAction.isBusy ? 'Probando...' : 'Probar conexión'}
          </Button>
          <ErrorLine message={testAction.error} />
          {result && (
            <div className={`flex items-start gap-2.5 rounded-lg p-3.5 text-sm ${result.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
              {result.ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <XCircle className="mt-0.5 size-4 shrink-0" />}
              <span>
                <span className="block font-medium">{result.ok ? 'Conexión correcta' : 'La conexión falló'}</span>
                {result.message}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
