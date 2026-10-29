import type { BadgeProps, BadgeTone } from '@/types/ui.types'
import { cn } from '@/utils/cn'

const TONE_STYLES: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-sky-50 text-sky-700',
  violet: 'bg-violet-50 text-violet-700',
}

const DOT_STYLES: Record<BadgeTone, string> = {
  neutral: 'bg-slate-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
  violet: 'bg-violet-500',
}

export function Badge({ className, tone = 'neutral', dot = true, children, ...props }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap', TONE_STYLES[tone], className)} {...props}>
      {dot && <span className={cn('size-1.5 rounded-full', DOT_STYLES[tone])} />}
      {children}
    </span>
  )
}
