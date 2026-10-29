import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import type { CompanyTabProps } from '../types/company.types'
import { TestBadge } from './TestBadge'

export function NubefactTab({ company }: CompanyTabProps) {
  const [tested, setTested] = useState(false)

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
            <CardContent className="space-y-4">
              <FormField label="URL de producción" htmlFor="production-url">
                <Input id="production-url" type="url" placeholder="https://api.nubefact.com/api/v1/…" />
              </FormField>
              <FormField label="Token de producción" htmlFor="production-token">
                <PasswordInput id="production-token" autoComplete="off" />
              </FormField>
              <Checkbox
                label="Entiendo que no se puede volver a pruebas"
                description="El último número de todas las series vuelve a 0. Si la empresa ya emitía en producción desde otro sistema, subiré el último número de cada serie."
              />
              <Button>Pasar a producción</Button>
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
          <CardContent className="space-y-4">
            <Input type="url" defaultValue={company.nubefactUrl} aria-label="URL de Nubefact" />
            <Button>Guardar URL</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Token</CardTitle>
              <CardDescription>
                Token actual: <span className="font-mono">••••{company.nubefactTokenLast4}</span>. Se guarda cifrado y nunca se muestra completo.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Nuevo token" htmlFor="new-token">
              <PasswordInput id="new-token" autoComplete="off" />
            </FormField>
            <Button>Reemplazar token</Button>
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
          <Button variant="outline" onClick={() => setTested(true)}>
            Probar conexión
          </Button>
          {tested && (
            <div className="flex items-start gap-2.5 rounded-lg bg-emerald-50 p-3.5 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              <span>
                <span className="block font-medium">Conexión correcta</span>
                Nubefact respondió que el comprobante no existe, como se esperaba (código 24).
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
