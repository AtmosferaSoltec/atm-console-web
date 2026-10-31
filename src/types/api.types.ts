export interface ApiErrorBody {
  error: {
    code: string
    message: string
  }
}

/** What a NestJS service answers on an error (atm-nubefact-api): `message` is a text or a list of validation failures. */
export interface NestErrorBody {
  statusCode?: number
  error?: string
  message?: string | string[]
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
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Multipart body, sent as is so the browser sets the boundary. Wins over `body`. */
  formData?: FormData
  /** Base URL of another service. Defaults to the auth API. */
  baseUrl?: string
  /** How to read a successful response. Defaults to 'json'; use 'blob' for files such as a PDF. */
  responseType?: 'json' | 'blob'
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
