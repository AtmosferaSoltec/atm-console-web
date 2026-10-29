import { getSessions } from '../services/sessionService'
import type { Session } from '../types/session.types'

export function useSessions(): Session[] {
  return getSessions()
}
