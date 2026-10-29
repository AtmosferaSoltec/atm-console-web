import { Badge } from '@/components/ui/badge'
import type { SessionBadgeProps } from '../types/system.types'

export function SessionBadge({ mode, minutes }: SessionBadgeProps) {
  return mode === 'persistent' ? (
    <Badge tone="info" dot={false}>
      Persistente
    </Badge>
  ) : (
    <Badge tone="warning" dot={false}>
      Temporal · {minutes} min
    </Badge>
  )
}
