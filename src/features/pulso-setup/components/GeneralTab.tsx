import { PauseCircle, Pencil, PlayCircle } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePulsoActions } from '@/features/pulso'
import { EditTenantDialog } from '@/features/tenants'
import type { CompanyTabProps } from '../types/pulsoSetup.types'

const BRAND_COLORS = ['#17677b', '#0fa68f', '#2f4f8f', '#6b3fa0', '#b4471b', '#c0392b', '#3d6b45', '#1a1a1a']

/** Profile of the company (kept in auth-api), its brand colour in Pulso and whether its people can work. */
export function GeneralTab({ company, onChanged }: CompanyTabProps) {
  const [editingProfile, setEditingProfile] = useState(false)
  const [color, setColor] = useState(company.brandColor)
  const [confirmingSuspend, setConfirmingSuspend] = useState(false)
  const colorActions = usePulsoActions()
  const statusActions = usePulsoActions()
  const suspended = company.status === 'suspended'
  const tenant = company.tenant
  const colors = BRAND_COLORS.includes(color) ? BRAND_COLORS : [...BRAND_COLORS, color]

  const pickColor = async (next: string) => {
    const previous = color
    setColor(next)
    if (await colorActions.setColor(company.id, next)) onChanged()
    else setColor(previous)
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
            <CardDescription>Pinta los botones y la boleta de Pulso para este gimnasio. Se guarda al elegirlo.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color de marca">
            {colors.map((item) => (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={color === item}
                aria-label={item}
                disabled={colorActions.isBusy}
                onClick={() => void pickColor(item)}
                className="size-8 cursor-pointer rounded-full ring-offset-2 transition aria-checked:ring-2 aria-checked:ring-slate-900 disabled:cursor-wait"
                style={{ backgroundColor: item }}
              />
            ))}
          </div>
          {colorActions.error && (
            <p role="alert" className="text-sm text-red-600">
              {colorActions.error}
            </p>
          )}
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
