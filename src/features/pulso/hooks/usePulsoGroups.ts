import { useApiQuery } from '@/hooks/useApiQuery'
import { listPulsoGroups } from '../services/pulsoService'
import type { PulsoGroup } from '../types/pulso.types'

export function usePulsoGroups(): { groups: PulsoGroup[]; isLoading: boolean; error: string | null; reload: () => void } {
  const { data, isLoading, error, reload } = useApiQuery(listPulsoGroups)
  return { groups: data ?? [], isLoading, error, reload }
}
