import { cn } from '@/utils/cn'
import type { AccountAvatarProps } from '../types/session.types'

const AVATAR_COLORS = [
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
]

export function AccountAvatar({ name }: AccountAvatarProps) {
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
  return <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase', color)}>{name.charAt(0)}</span>
}
