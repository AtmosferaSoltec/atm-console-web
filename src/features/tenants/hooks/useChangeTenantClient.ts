import { useState } from 'react'
import { setTenantClient } from '../services/tenantService'
import { tenantErrorMessage } from './tenantErrors'

export function useChangeTenantClient() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the company was moved. */
  const change = async (tenantId: string, clientId: string): Promise<boolean> => {
    setIsSaving(true)
    setError(null)
    try {
      await setTenantClient(tenantId, clientId)
      return true
    } catch (caught) {
      setError(tenantErrorMessage(caught, 'No se pudo cambiar el cliente. Intenta de nuevo.'))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { change, isSaving, error, clearError: () => setError(null) }
}
