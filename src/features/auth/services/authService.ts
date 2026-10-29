import { request } from '@/services/httpClient'
import { saveSession } from '@/store/sessionStore'
import type { TokenResponse } from '@/types/api.types'
import type { LoginFormValues } from '../types/auth.types'

export async function adminLogin({ username, password }: LoginFormValues): Promise<void> {
  const tokens = await request<TokenResponse>('/v1/admin/login', {
    method: 'POST',
    // The API still names the superadmin identifier `dni`, but it is an opaque string.
    body: { dni: username, password },
    auth: false,
  })
  saveSession(tokens)
}

export async function revokeSession(refreshToken: string): Promise<void> {
  await request<void>('/v1/logout', { method: 'POST', body: { refresh_token: refreshToken }, auth: false })
}
