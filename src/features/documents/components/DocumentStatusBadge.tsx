import { Badge } from '@/components/ui/badge'
import type { DocumentStatus, DocumentStatusBadgeProps, StatusBadgeConfig } from '../types/document.types'

export const DOCUMENT_STATUS_BADGES: Record<DocumentStatus, StatusBadgeConfig> = {
  PENDING: { label: 'Pendiente', tone: 'neutral' },
  SUBMITTED: { label: 'Enviado', tone: 'info' },
  ACCEPTED: { label: 'Aceptado', tone: 'success' },
  REJECTED: { label: 'Rechazado', tone: 'danger' },
  VOID_SUBMITTED: { label: 'Anulación enviada', tone: 'warning' },
  VOIDED: { label: 'Anulado', tone: 'neutral' },
  NEEDS_REVIEW: { label: 'Requiere revisión', tone: 'warning' },
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  const { label, tone } = DOCUMENT_STATUS_BADGES[status]
  return <Badge tone={tone}>{label}</Badge>
}
