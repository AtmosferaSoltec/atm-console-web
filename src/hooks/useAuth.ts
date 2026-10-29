import { useSyncExternalStore } from 'react'
import { getSession, subscribeSession } from '@/store/sessionStore'

export function useAuth(): { isAuthenticated: boolean } {
  const session = useSyncExternalStore(subscribeSession, getSession)
  return { isAuthenticated: session !== null }
}
