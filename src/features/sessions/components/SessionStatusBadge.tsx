import { Badge } from '@/components/ui/badge'
import type { BadgeTone } from '@/types/ui.types'
import type { SessionStatus, SessionStatusBadgeProps } from '../types/session.types'

const STATUS_BADGES: Record<SessionStatus, { label: string; tone: BadgeTone }> = {
  connected: { label: 'Conectada', tone: 'success' },
  pending_qr: { label: 'Esperando QR', tone: 'info' },
  disconnected: { label: 'Desconectada', tone: 'warning' },
  banned: { label: 'Bloqueada', tone: 'danger' },
}

export function SessionStatusBadge({ status }: SessionStatusBadgeProps) {
  const { label, tone } = STATUS_BADGES[status]
  return <Badge tone={tone}>{label}</Badge>
}
