export interface ApiErrorBody {
  error: {
    code: string
    message: string
  }
}

/** Token payload returned by the auth API on login and refresh. */
export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface SessionTokens {
  accessToken: string
  refreshToken: string
  /** Epoch milliseconds when the access token expires. */
  expiresAt: number
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  /** Attach the bearer token and refresh it when needed. Defaults to true. */
  auth?: boolean
  signal?: AbortSignal
}

export interface ApiQuery<T> {
  data: T | null
  isLoading: boolean
  /** Message ready to show to the user, or null. */
  error: string | null
  reload: () => void
}
