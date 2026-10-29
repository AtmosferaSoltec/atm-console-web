import { useCallback } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { listRoles } from '../services/roleService'
import type { RoleItem } from '../types/role.types'

interface RolesResult {
  roles: RoleItem[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

/** Roles of one system. With no system (an empty id) there is nothing to load. */
export function useRoles(systemId: string): RolesResult {
  const fetcher = useCallback((signal: AbortSignal) => (systemId ? listRoles(systemId, signal) : Promise.resolve([])), [systemId])
  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return { roles: data ?? [], isLoading, error, reload }
}
