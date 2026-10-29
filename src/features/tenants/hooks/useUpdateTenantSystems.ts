import { useState } from 'react'
import { ApiError } from '@/services/httpClient'
import { disableTenantSystem, enableTenantSystem } from '../services/tenantService'
import type { TenantSystemChange } from '../types/tenant.types'

/** The change was already applied (the list was stale), so there is nothing left to do. */
function alreadyApplied(error: unknown, change: TenantSystemChange): boolean {
  if (!(error instanceof ApiError)) return false
  return change.enable ? error.code === 'system_already_enabled' : error.code === 'system_not_enabled'
}

export function useUpdateTenantSystems() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Applies every change and resolves to true only if all of them went through. */
  const save = async (tenantId: string, changes: TenantSystemChange[]): Promise<boolean> => {
    setIsSaving(true)
    setError(null)
    const failed: string[] = []
    for (const change of changes) {
      try {
        await (change.enable ? enableTenantSystem(tenantId, change.systemId) : disableTenantSystem(tenantId, change.systemId))
      } catch (caught) {
        if (!alreadyApplied(caught, change)) failed.push(change.name)
      }
    }
    setIsSaving(false)
    if (failed.length > 0) setError(`No se pudo actualizar: ${failed.join(', ')}. Intenta de nuevo.`)
    return failed.length === 0
  }

  return { save, isSaving, error }
}
