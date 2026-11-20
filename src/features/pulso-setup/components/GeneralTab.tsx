import { PauseCircle, Pencil, PlayCircle } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePulsoActions } from '@/features/pulso'
import { EditTenantDialog } from '@/features/tenants'
import { ColorField } from './ColorField'
import type { CompanyTabProps } from '../types/pulsoSetup.types'

/** Profile of the company (kept in auth-api), its brand colour in Pulso and whether its people can work. */
export function GeneralTab({ company, onChanged }: CompanyTabProps) {
  const [editingProfile, setEditingProfile] = useState(false)
  const [color, setColor] = useState(company.brandColor)
  const [confirmingSuspend, setConfirmingSuspend] = useState(false)
  const colorActions = usePulsoActions()
  const statusActions = usePulsoActions()
  const suspended = company.status === 'suspended'
  const tenant = company.tenant

  const saveColor = async (next: string): Promise<boolean> => {
    if (!(await colorActions.setColor(company.id, next))) return false
    setColor(next)
    onChanged()
    return true
  }

  const setStatus = async (next: 'active' | 'suspended') => {
    if (await statusActions.setStatus(company.id, next)) onChanged()
  }

  const profile: [string, string][] = tenant
    ? [
        ['Razón social', tenant.legalName],
        ['Nombre comercial', tenant.tradeName || '—'],
        ['RUC', tenant.ruc || 'Sin RUC'],
        ['Dirección', [tenant.address, tenant.district, tenant.province].filter(Boolean).join(', ') || '—'],
        ['Teléfono', tenant.phone || '—'],
        ['Correo', tenant.email || '—'],
      ]
    : []

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Datos de la empresa</CardTitle>
            <CardDescription>Salen en las boletas y en el inicio de sesión del gimnasio. Se comparten con los demás sistemas de Atmósfera.</CardDescription>
          </div>
          {tenant && (
            <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)}>
              <Pencil className="size-4" />
              Editar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {tenant ? (
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {profile.map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="truncate text-sm text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-slate-500">No se encontró la empresa en el registro de Atmósfera.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Color de marca</CardTitle>
            <CardDescription>Pinta los botones y la boleta de Pulso para este gimnasio. Elige uno rápido, escribe el HEX del cliente o usa el selector, y guarda.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ColorField value={color} onSave={saveColor} busy={colorActions.isBusy} error={colorActions.error} />
        </CardContent>
      </Card>

      <Card className={suspended ? 'border-amber-200' : undefined}>
        <CardHeader>
          <div>
            <CardTitle>{suspended ? 'Empresa suspendida' : 'Suspender empresa'}</CardTitle>
            <CardDescription>
              {suspended
                ? 'Nadie de esta empresa puede entrar a Pulso. Sus datos siguen guardados.'
                : 'Por falta de pago, por ejemplo. Su personal no podrá usar Pulso hasta que la reactives. No se borra nada.'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={suspended ? 'primary' : 'outline'}
            disabled={statusActions.isBusy}
            onClick={() => (suspended ? void setStatus('active') : setConfirmingSuspend(true))}
          >
            {suspended ? <PlayCircle className="size-4" /> : <PauseCircle className="size-4" />}
            {suspended ? 'Reactivar' : 'Suspender'}
          </Button>
          {statusActions.error && (
            <p role="alert" className="text-sm text-red-600">
              {statusActions.error}
            </p>
          )}
        </CardContent>
      </Card>

      <EditTenantDialog
        tenant={editingProfile && tenant ? tenant : null}
        onClose={() => setEditingProfile(false)}
        onSaved={() => {
          setEditingProfile(false)
          onChanged()
        }}
      />
      <ConfirmDialog
        open={confirmingSuspend}
        onClose={() => setConfirmingSuspend(false)}
        onConfirm={() => {
          setConfirmingSuspend(false)
          void setStatus('suspended')
        }}
        title={`¿Suspender ${company.tradeName}?`}
        description="Desde su siguiente acción, nadie de esta empresa puede usar Pulso en la web ni en la app hasta que la reactives."
        confirmLabel="Suspender"
        destructive
      />
    </div>
  )
}
