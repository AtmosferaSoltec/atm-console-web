import { useApiQuery } from '@/hooks/useApiQuery'
import { listPulsoClients } from '../services/pulsoService'
import type { PulsoClient } from '../types/pulso.types'

export function usePulsoClients(): { clients: PulsoClient[]; isLoading: boolean; error: string | null; reload: () => void } {
  const { data, isLoading, error, reload } = useApiQuery(listPulsoClients)
  return { clients: data ?? [], isLoading, error, reload }
}
