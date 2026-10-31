import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/config/routes'
import { companyErrorMessage, grantCompanySystem, revokeCompanySystem } from '@/features/companies'
import { LAVENDIMIA_SYSTEM_CODE, type LavendimiaBillingSwitchProps } from '../types/lavendimia.types'

export function LavendimiaBillingSwitch({ access, onChanged }: LavendimiaBillingSwitchProps) {
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!access) return <span className="text-slate-400">Cargando...</span>

  if (access.kind === 'no-issuer') {
    return (
      <span className="flex flex-wrap items-center gap-2">
        <Badge tone="neutral" dot={false}>
          Sin emisor
        </Badge>
        <Link to={ROUTES.billing.companyNew} className="text-xs font-medium text-brand-700 hover:text-brand-800">
          Registrar emisor
        </Link>
      </span>
    )
  }

  const toggle = async (allowed: boolean) => {
    setIsBusy(true)
    setError(null)
    try {
      await (allowed ? grantCompanySystem(access.issuerId, LAVENDIMIA_SYSTEM_CODE) : revokeCompanySystem(access.issuerId, LAVENDIMIA_SYSTEM_CODE))
      onChanged()
    } catch (caught) {
      setError(companyErrorMessage(caught, 'No se pudo cambiar el permiso.'))
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <span className="block">
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
        <input
          type="checkbox"
          role="switch"
          aria-label="Puede emitir comprobantes"
          checked={access.allowed}
          disabled={isBusy}
          onChange={(event) => void toggle(event.target.checked)}
          className="size-4 accent-slate-900"
        />
        {access.allowed ? 'Puede emitir' : 'No emite'}
      </label>
      {error && (
        <span role="alert" className="mt-1 block text-xs text-red-600">
          {error}
        </span>
      )}
    </span>
  )
}
