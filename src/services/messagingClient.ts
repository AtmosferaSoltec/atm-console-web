import { MESSAGING_API_BASE_URL } from '@/config/env'
import { request } from '@/services/httpClient'
import type { RequestOptions } from '@/types/api.types'

/** Calls the messaging API with the operator's access token (the same one the auth API issued). */
export function messagingRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return request<T>(path, { ...options, baseUrl: MESSAGING_API_BASE_URL })
}
