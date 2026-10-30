import { useMemo } from 'react'
import { useTenants } from '@/features/tenants'
import type { StorageNames } from '../types/storage.types'

/** Names for the company UUIDs and system codes that the storage API returns. */
export function useStorageNames(): StorageNames {
  const { tenants, isLoading } = useTenants()
  return useMemo(() => {
    const companyNames: Record<string, string> = {}
    const systemNames: Record<string, string> = {}
    for (const tenant of tenants) {
      companyNames[tenant.id] = tenant.displayName
      for (const system of tenant.systems) systemNames[system.code] = system.name
    }
    return { tenants, isLoading, companyNames, systemNames }
  }, [tenants, isLoading])
}
