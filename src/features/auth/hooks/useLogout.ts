import { clearSession, getSession } from '@/store/sessionStore'
import { revokeSession } from '../services/authService'

/** Ends the session locally and, best effort, on the server. */
export function useLogout(): () => Promise<void> {
  return async () => {
    const session = getSession()
    clearSession()
    if (!session) return
    try {
      await revokeSession(session.refreshToken)
    } catch {
      // The local session is already gone; an unreachable server must not block signing out.
    }
  }
}
