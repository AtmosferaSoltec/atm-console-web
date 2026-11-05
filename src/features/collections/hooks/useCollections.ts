import { useCallback } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { getCollectionClient, getCollectionsSummary, getStatement, listCharges, listCollectionClients } from '../services/collectionsService'

export function useCollectionClients() {
  const { data, isLoading, error, reload } = useApiQuery(listCollectionClients)
  return { clients: data ?? [], isLoading, error, reload }
}

export function useCollectionsSummary() {
  const { data, isLoading, error, reload } = useApiQuery(getCollectionsSummary)
  return { summary: data, isLoading, error, reload }
}

export function useCollectionClient(clientId: string) {
  const fetcher = useCallback((signal: AbortSignal) => getCollectionClient(clientId, signal), [clientId])
  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return { client: data, isLoading, error, reload }
}

/** Every charge, or only those of one client when `clientId` is given. */
export function useCharges(clientId: string | null) {
  const fetcher = useCallback((signal: AbortSignal) => listCharges(clientId, signal), [clientId])
  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return { charges: data ?? [], isLoading, error, reload }
}

/** The public statement behind a client's link. */
export function useStatement(token: string) {
  const fetcher = useCallback((signal: AbortSignal) => getStatement(token, signal), [token])
  const { data, isLoading, error } = useApiQuery(fetcher)
  return { statement: data, isLoading, error }
}
