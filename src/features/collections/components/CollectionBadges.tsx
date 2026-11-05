import { Badge } from '@/components/ui/badge'
import type { BadgeTone } from '@/types/ui.types'
import type { AccountStatus, AccountStatusBadgeProps, ChargeStatus, ChargeStatusBadgeProps } from '../types/collections.types'
import { ACCOUNT_STATUS_LABELS, CHARGE_STATUS_LABELS } from '../utils/labels'

const CHARGE_TONES: Record<ChargeStatus, BadgeTone> = {
  pending: 'info',
  paid: 'success',
}

const ACCOUNT_TONES: Record<AccountStatus, BadgeTone> = {
  current: 'success',
  pending: 'info',
}

export function ChargeStatusBadge({ status }: ChargeStatusBadgeProps) {
  return <Badge tone={CHARGE_TONES[status]}>{CHARGE_STATUS_LABELS[status]}</Badge>
}

export function AccountStatusBadge({ status }: AccountStatusBadgeProps) {
  return <Badge tone={ACCOUNT_TONES[status]}>{ACCOUNT_STATUS_LABELS[status]}</Badge>
}
