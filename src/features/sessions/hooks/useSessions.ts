import { useMemo } from 'react'
import { useMessagingSystems } from '@/features/messaging-systems'
import { useApiQuery } from '@/hooks/useApiQuery'
import { listSessions } from '../services/sessionService'
import type { Session } from '../types/session.types'

// A customer can scan a QR at any moment, so the list refreshes by itself.
const SESSIONS_REFRESH_MS = 8_000

interface SessionsResult {
  sessions: Session[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

export function useSessions(): SessionsResult {
  const { data, isLoading, error, reload } = useApiQuery(listSessions, SESSIONS_REFRESH_MS)
  const { systems } = useMessagingSystems()

  const sessions = useMemo<Session[]>(() => {
    const nameByTenant = new Map(systems.filter((system) => system.tenantId).map((system) => [system.tenantId, system.name]))
    return (data ?? []).map((session) => ({ ...session, clientName: nameByTenant.get(session.tenantId) ?? '—' }))
  }, [data, systems])

  return { sessions, isLoading, error, reload }
}
