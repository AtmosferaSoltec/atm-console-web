import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useUserActions } from '../hooks/useUserActions'
import type { UserActionsProps } from '../types/user.types'

type Pending = 'reset' | 'status'

export function UserActions({ user, onChanged }: UserActionsProps) {
  const { resetPassword, setStatus, isWorking, notice, error } = useUserActions()
  const [pending, setPending] = useState<Pending | null>(null)

  const disabling = user.status === 'active'

  const handleConfirm = async () => {
    const action = pending
    setPending(null)
    const ok = action === 'reset' ? await resetPassword(user.id) : await setStatus(user.id, disabling ? 'disabled' : 'active')
    if (ok) onChanged()
  }

  return (
    <Card className="divide-y divide-slate-100">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Restablecer contraseña</h2>
          <p className="mt-0.5 text-sm text-slate-500">Vuelve a ser su DNI, debe cambiarla al ingresar y se cierran sus sesiones.</p>
        </div>
        <Button variant="outline" disabled={isWorking} onClick={() => setPending('reset')}>
          Restablecer contraseña
        </Button>
      </div>
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{disabling ? 'Desactivar cuenta' : 'Activar cuenta'}</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {disabling ? 'No podrá ingresar a ningún sistema y se cierran sus sesiones.' : 'Podrá volver a ingresar a los sistemas donde tiene acceso.'}
          </p>
        </div>
        <Button variant={disabling ? 'danger' : 'outline'} disabled={isWorking} onClick={() => setPending('status')}>
          {disabling ? 'Desactivar cuenta' : 'Activar cuenta'}
        </Button>
      </div>
      {(notice || error) && (
        <p role={error ? 'alert' : 'status'} className={error ? 'p-5 text-sm text-red-600' : 'p-5 text-sm text-emerald-600'}>
          {error ?? notice}
        </p>
      )}

      <ConfirmDialog
        open={pending === 'reset'}
        onClose={() => setPending(null)}
        onConfirm={handleConfirm}
        title="Restablecer contraseña"
        description={`La contraseña de ${user.fullName} volverá a ser su DNI y deberá cambiarla al ingresar. Se cerrarán sus sesiones.`}
        confirmLabel="Restablecer"
      />
      <ConfirmDialog
        open={pending === 'status'}
        onClose={() => setPending(null)}
        onConfirm={handleConfirm}
        title={disabling ? 'Desactivar cuenta' : 'Activar cuenta'}
        description={
          disabling
            ? `${user.fullName} no podrá ingresar a ningún sistema y se cerrarán sus sesiones. Sus accesos se conservan.`
            : `${user.fullName} podrá volver a ingresar a los sistemas donde tiene acceso.`
        }
        confirmLabel={disabling ? 'Desactivar' : 'Activar'}
        destructive={disabling}
      />
    </Card>
  )
}
