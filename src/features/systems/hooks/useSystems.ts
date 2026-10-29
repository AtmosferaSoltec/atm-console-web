import { useApiQuery } from '@/hooks/useApiQuery'
import { listSystems } from '../services/systemService'
import type { SystemItem } from '../types/system.types'

interface SystemsResult {
  systems: SystemItem[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

export function useSystems(): SystemsResult {
  const { data, isLoading, error, reload } = useApiQuery(listSystems)
  return { systems: data ?? [], isLoading, error, reload }
}

/** The API has no single-system endpoint, so the system is picked from the list. */
export function useSystem(systemId: string | undefined) {
  const { systems, isLoading, error, reload } = useSystems()
  return { system: systems.find((item) => item.id === systemId), isLoading, error, reload }
}
