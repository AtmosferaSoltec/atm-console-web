import { useApiQuery } from '@/hooks/useApiQuery'
import { listTenants } from '../services/tenantService'
import type { TenantItem } from '../types/tenant.types'

interface TenantsResult {
  tenants: TenantItem[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

export function useTenants(): TenantsResult {
  const { data, isLoading, error, reload } = useApiQuery(listTenants)
  return { tenants: data ?? [], isLoading, error, reload }
}
