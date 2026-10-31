import { API_BASE_URL } from '@/config/env'
import { clearSession, getSession, saveSession } from '@/store/sessionStore'
import type { ApiErrorBody, NestErrorBody, RequestOptions, TokenResponse } from '@/types/api.types'

/** Refresh the access token this long before it actually expires. */
const REFRESH_MARGIN_MS = 30_000

export class ApiError extends Error {
  status: number
  code: string
  retryAfterSeconds?: number

  constructor(status: number, code: string, message: string, retryAfterSeconds?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.retryAfterSeconds = retryAfterSeconds
  }
}

async function send<T>(path: string, options: RequestOptions, accessToken?: string): Promise<T> {
  const headers: Record<string, string> = {}
  if (options.body !== undefined && !options.formData) headers['Content-Type'] = 'application/json'
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  const response = await fetch(`${options.baseUrl ?? API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.formData ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
    signal: options.signal,
  })

  if (response.ok) {
    if (response.status === 204) return undefined as T
    return (options.responseType === 'blob' ? await response.blob() : await response.json()) as T
  }

  const body = (await response.json().catch(() => null)) as ApiErrorBody | NestErrorBody | null
  const retryAfter = Number(response.headers.get('Retry-After'))
  const { code, message } = readError(body)
  throw new ApiError(response.status, code, message, retryAfter > 0 ? retryAfter : undefined)
}

/** The two error shapes the services answer with: `{ error: { code, message } }`, or Nest's `{ error, message }`. */
function readError(body: ApiErrorBody | NestErrorBody | null): { code: string; message: string } {
  if (!body) return { code: 'unknown_error', message: 'Unexpected error.' }
  if (typeof body.error === 'object' && body.error !== null) {
    return { code: body.error.code ?? 'unknown_error', message: body.error.message ?? 'Unexpected error.' }
  }
  const nest = body as NestErrorBody
  const message = Array.isArray(nest.message) ? nest.message.join('. ') : (nest.message ?? 'Unexpected error.')
  return { code: typeof nest.error === 'string' ? nest.error : 'unknown_error', message }
}

// Concurrent requests share one refresh: the API rotates refresh tokens, so a second call would revoke the session.
let refreshing: Promise<string> | null = null

function refreshAccessToken(): Promise<string> {
  refreshing ??= (async () => {
    const session = getSession()
    if (!session) throw new ApiError(401, 'no_session', 'There is no active session.')
    try {
      const tokens = await send<TokenResponse>('/v1/refresh', {
        method: 'POST',
        body: { refresh_token: session.refreshToken },
      })
      saveSession(tokens)
      return tokens.access_token
    } catch (error) {
      if (error instanceof ApiError) clearSession()
      throw error
    } finally {
      refreshing = null
    }
  })()
  return refreshing
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (options.auth === false) return send<T>(path, options)

  const session = getSession()
  if (!session) throw new ApiError(401, 'no_session', 'There is no active session.')

  const token = session.expiresAt - Date.now() < REFRESH_MARGIN_MS ? await refreshAccessToken() : session.accessToken
  try {
    return await send<T>(path, options, token)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return send<T>(path, options, await refreshAccessToken())
    }
    throw error
  }
}
