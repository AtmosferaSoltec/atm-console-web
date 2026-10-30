import { useCallback, useMemo } from 'react'
import { useMessagingSystems } from '@/features/messaging-systems'
import { useSessions } from '@/features/sessions'
import { useApiQuery } from '@/hooks/useApiQuery'
import { listMessages } from '../services/messageService'
import type { MessageFiltersValue, MessagesResult } from '../types/message.types'

const MESSAGES_REFRESH_MS = 10_000

export function useMessages(filters: MessageFiltersValue, page: number, pageSize: number): MessagesResult {
  const { tenantId, status, priority, search } = filters
  const fetcher = useCallback(
    (signal: AbortSignal) => listMessages({ tenantId, status, priority, search }, page, pageSize, signal),
    [tenantId, status, priority, search, page, pageSize],
  )
  const { data, isLoading, error } = useApiQuery(fetcher, MESSAGES_REFRESH_MS)
  const { sessions } = useSessions()
  const { systems } = useMessagingSystems()

  const rows = useMemo(() => {
    const accountBySession = new Map(sessions.map((session) => [session.id, session.accountRef]))
    const nameByTenant = new Map(systems.filter((system) => system.tenantId).map((system) => [system.tenantId, system.name]))
    return (data?.items ?? []).map((message) => ({
      ...message,
      accountRef: accountBySession.get(message.sessionId) ?? '—',
      clientName: nameByTenant.get(message.tenantId) ?? '—',
    }))
  }, [data, sessions, systems])

  return { rows, hasMore: data?.hasMore ?? false, isLoading, error }
}
