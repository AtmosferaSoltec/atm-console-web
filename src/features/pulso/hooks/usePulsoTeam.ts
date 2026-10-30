import { useApiQuery } from '@/hooks/useApiQuery'
import { listPulsoTeam } from '../services/pulsoService'
import type { PulsoTeam } from '../types/pulso.types'

const EMPTY_TEAM: PulsoTeam = { systemId: null, members: [] }

export function usePulsoTeam(): { team: PulsoTeam; isLoading: boolean; error: string | null; reload: () => void } {
  const { data, isLoading, error, reload } = useApiQuery(listPulsoTeam)
  return { team: data ?? EMPTY_TEAM, isLoading, error, reload }
}
