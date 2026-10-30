import type { LucideIcon } from 'lucide-react'

export type ConnectSessionStatus = 'pending_qr' | 'connected' | 'disconnected' | 'banned'

export interface ConnectInfo {
  label: string
  status: ConnectSessionStatus
  /** ISO date when the link stops working. */
  expiresAt: string
}

export interface ConnectInfoResponse {
  label: string
  channel: string
  status: ConnectSessionStatus
  expires_at: string
}

/** What the public page is showing right now. */
export type ConnectPageState =
  | 'loading' // reading the link
  | 'waiting' // QR on screen (or about to be)
  | 'connected' // the customer scanned it
  | 'retry' // the QR expired without a scan
  | 'blocked' // WhatsApp blocked the number
  | 'invalid' // the link is unknown, replaced or expired
  | 'error' // the server cannot be reached

export interface QrStreamHandlers {
  onQr: (code: string) => void
  onConnected: () => void
  onClosed: (reason: string) => void
  /** The server refused the stream (e.g. the link is no longer valid); it will not retry. */
  onRejected: () => void
}

export interface ConnectSession {
  state: ConnectPageState
  info: ConnectInfo | null
  qr: string | null
  /** Asks for a fresh QR after the previous one expired. */
  retry: () => void
}

export interface QrFrameProps {
  /** The code to draw. Null while the first one is being generated. */
  value: string | null
}

export interface ConnectedNoticeProps {
  label: string
}

export type NoticeTone = 'amber' | 'red' | 'slate'

export interface NoticeProps {
  icon: LucideIcon
  tone: NoticeTone
  title: string
  description: string
  spin?: boolean
  action?: { label: string; onClick: () => void }
}
