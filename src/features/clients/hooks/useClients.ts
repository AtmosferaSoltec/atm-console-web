import { useApiQuery } from '@/hooks/useApiQuery'
import { listClients } from '../services/clientService'
import type { ClientItem } from '../types/client.types'

interface ClientsResult {
  clients: ClientItem[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

export function useClients(): ClientsResult {
  const { data, isLoading, error, reload } = useApiQuery(listClients)
  return { clients: data ?? [], isLoading, error, reload }
}
