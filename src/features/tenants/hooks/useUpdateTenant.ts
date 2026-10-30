import { useState } from 'react'
import { updateTenant } from '../services/tenantService'
import type { UpdateTenantInput } from '../types/tenant.types'
import { tenantErrorMessage } from './tenantErrors'

export function useUpdateTenant() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the profile was saved. */
  const save = async (tenantId: string, input: UpdateTenantInput): Promise<boolean> => {
    setIsSaving(true)
    setError(null)
    try {
      await updateTenant(tenantId, input)
      return true
    } catch (caught) {
      setError(tenantErrorMessage(caught, 'No se pudo guardar la empresa. Intenta de nuevo.'))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { save, isSaving, error, clearError: () => setError(null) }
}
