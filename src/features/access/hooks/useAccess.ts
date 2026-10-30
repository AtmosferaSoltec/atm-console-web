import { useCallback } from 'react'
import { useSystems, type SystemItem } from '@/features/systems'
import { useApiQuery } from '@/hooks/useApiQuery'
import { listAccessBySystem, listAccessBySystems, listAccessByUser } from '../services/accessService'
import type { AccessItem } from '../types/access.types'

interface AccessResult {
  items: AccessItem[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

export function useAccessByUser(userId: string): AccessResult {
  const fetcher = useCallback((signal: AbortSignal) => listAccessByUser(userId, signal), [userId])
  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return { items: data ?? [], isLoading, error, reload }
}

export function useAccessBySystem(systemId: string): AccessResult {
  const fetcher = useCallback((signal: AbortSignal) => listAccessBySystem(systemId, signal), [systemId])
  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return { items: data ?? [], isLoading, error, reload }
}

interface AllAccessResult extends AccessResult {
  systems: SystemItem[]
}

/** The accesses of every system, to see who belongs where. One request per system. */
export function useAllAccess(): AllAccessResult {
  const { systems, isLoading: systemsLoading, error: systemsError, reload: reloadSystems } = useSystems()
  const idsKey = systems.map((system) => system.id).join(',')
  const fetcher = useCallback((signal: AbortSignal) => listAccessBySystems(idsKey ? idsKey.split(',') : [], signal), [idsKey])
  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return {
    items: data ?? [],
    systems,
    isLoading: systemsLoading || isLoading,
    error: systemsError ?? error,
    reload: () => {
      reloadSystems()
      reload()
    },
  }
}
