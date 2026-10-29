import type { SessionTokens, TokenResponse } from '@/types/api.types'

const STORAGE_KEY = 'atm-console-session'

type Listener = () => void

const listeners = new Set<Listener>()

function read(): SessionTokens | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SessionTokens) : null
  } catch {
    return null
  }
}

// The snapshot must keep its identity between reads, so it is cached here.
let current: SessionTokens | null = read()

function emit(next: SessionTokens | null) {
  current = next
  try {
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage may be unavailable (private mode); the session then lives only in memory.
  }
  listeners.forEach((listener) => listener())
}

export function getSession(): SessionTokens | null {
  return current
}

export function subscribeSession(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function saveSession(tokens: TokenResponse): void {
  emit({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  })
}

export function clearSession(): void {
  emit(null)
}
