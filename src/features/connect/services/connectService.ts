import { MESSAGING_API_BASE_URL } from '@/config/env'
import { messagingRequest } from '@/services/messagingClient'
import type { ConnectInfo, ConnectInfoResponse, QrStreamHandlers } from '../types/connect.types'

/** Public: the token in the link is the credential, so no session is sent. */
export async function getConnectInfo(token: string, signal?: AbortSignal): Promise<ConnectInfo> {
  const info = await messagingRequest<ConnectInfoResponse>(`/public/connect/${encodeURIComponent(token)}`, { auth: false, signal })
  return { label: info.label, status: info.status, expiresAt: info.expires_at }
}

/**
 * Follows the QR of a link over Server-Sent Events. Returns a function that closes the stream.
 * The browser reconnects by itself after network drops.
 */
export function openQrStream(token: string, handlers: QrStreamHandlers): () => void {
  const source = new EventSource(`${MESSAGING_API_BASE_URL}/public/connect/${encodeURIComponent(token)}/qr/stream`)

  source.addEventListener('qr', (event) => handlers.onQr((event as MessageEvent<string>).data))
  source.addEventListener('connected', () => {
    source.close()
    handlers.onConnected()
  })
  source.addEventListener('closed', (event) => {
    source.close()
    handlers.onClosed((event as MessageEvent<string>).data)
  })
  source.addEventListener('error', () => {
    // CLOSED means the browser gave up (the server answered with an error status).
    if (source.readyState === EventSource.CLOSED) handlers.onRejected()
  })

  return () => source.close()
}
