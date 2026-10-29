import { Badge } from '@/components/ui/badge'
import type { SessionBadgeProps } from '../types/system.types'

export function SessionBadge({ mode }: SessionBadgeProps) {
  return mode === 'persistent' ? (
    <Badge tone="info" dot={false}>
      Persistente
    </Badge>
  ) : (
    <Badge tone="warning" dot={false}>
      Temporal
    </Badge>
  )
}
