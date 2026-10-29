import { Badge } from '@/components/ui/badge'
import type { EntityStatus } from '@/types/common.types'
import type { BadgeTone, StatusBadgeProps } from '@/types/ui.types'

const STATUS_LABELS: Record<EntityStatus, string> = {
  active: 'Activo',
  disabled: 'Deshabilitado',
}

const STATUS_TONES: Record<EntityStatus, BadgeTone> = {
  active: 'success',
  disabled: 'neutral',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge tone={STATUS_TONES[status]}>{STATUS_LABELS[status]}</Badge>
}
