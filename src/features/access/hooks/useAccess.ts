import { useCallback } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { listAccessBySystem, listAccessByUser } from '../services/accessService'
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
