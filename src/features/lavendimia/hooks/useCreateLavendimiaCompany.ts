import { useState } from 'react'
import { createTenant, enableTenantSystem, tenantErrorMessage } from '@/features/tenants'
import type { NewLavendimiaCompanyInput } from '../types/lavendimia.types'

export function useCreateLavendimiaCompany() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Creates the company and enables La Vendimia for it. Resolves to true only when both went through. */
  const create = async (input: NewLavendimiaCompanyInput): Promise<boolean> => {
    setIsSaving(true)
    setError(null)
    let tenantId: string
    try {
      const tenant = await createTenant({
        ruc: input.ruc,
        legalName: input.legalName,
        tradeName: input.tradeName,
        clientId: input.clientId || undefined,
      })
      tenantId = tenant.id
    } catch (caught) {
      setError(tenantErrorMessage(caught, 'No se pudo crear la empresa. Intenta de nuevo.'))
      setIsSaving(false)
      return false
    }

    try {
      await enableTenantSystem(tenantId, input.systemId)
      return true
    } catch {
      // The company exists already: say so, or a retry would hit "RUC already exists".
      setError('La empresa se creó, pero no se pudo habilitar La Vendimia. Habilítala desde Autenticación > Empresas.')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { create, isSaving, error, clearError: () => setError(null) }
}
