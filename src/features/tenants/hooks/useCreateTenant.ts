import { useState } from 'react'
import { createTenant } from '../services/tenantService'
import type { CreateTenantInput } from '../types/tenant.types'
import { tenantErrorMessage } from './tenantErrors'

export function useCreateTenant() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the tenant was created. */
  const create = async (input: CreateTenantInput): Promise<boolean> => {
    setIsSaving(true)
    setError(null)
    try {
      await createTenant(input)
      return true
    } catch (caught) {
      setError(tenantErrorMessage(caught, 'No se pudo crear la empresa. Intenta de nuevo.'))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { create, isSaving, error, clearError: () => setError(null) }
}
