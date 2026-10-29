import { FormField } from '@/components/common/FormField'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import type { CompanyTabProps } from '../types/company.types'

export function GeneralTab({ company }: CompanyTabProps) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="grid gap-6 p-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Datos</CardTitle>
            <CardDescription>El RUC no se puede cambiar.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Razón social" htmlFor="general-name">
            <Input id="general-name" defaultValue={company.name} />
          </FormField>
          <FormField label="Email de Nubefact" htmlFor="general-email">
            <Input id="general-email" type="email" defaultValue={company.nubefactEmail ?? ''} placeholder="(sin email)" />
          </FormField>
          <FormField
            label="Límite mensual de documentos"
            htmlFor="general-limit"
            hint="Facturas, boletas y guías que permite su plan de Nubefact al mes. Solo se usa en la pantalla de consumo."
          >
            <Input id="general-limit" type="number" min={1} defaultValue={company.monthlyDocumentLimit} />
          </FormField>
          <Button>Guardar</Button>
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
        onClose={() => setConfirming(false)}
        onConfirm={() => setConfirming(false)}
        title={company.isActive ? '¿Desactivar la empresa?' : '¿Activar la empresa?'}
        description={
          company.isActive
            ? 'Sus sistemas dejarán de poder emitir de inmediato: todas sus API keys serán rechazadas hasta que la vuelvas a activar.'
            : 'Sus API keys vigentes volverán a funcionar.'
        }
        confirmLabel={company.isActive ? 'Desactivar' : 'Activar'}
        destructive={company.isActive}
      />
    </div>
  )
}
