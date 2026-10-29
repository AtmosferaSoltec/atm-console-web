import logoOnDark from '@/assets/brand/logo-full-light.svg'
import logoOnLight from '@/assets/brand/logo-full-dark.svg'
import type { BrandMarkProps } from '@/types/ui.types'
import { cn } from '@/utils/cn'

export function BrandMark({ tone = 'dark', className }: BrandMarkProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img src={tone === 'light' ? logoOnDark : logoOnLight} alt="Atmosfera" className="h-6 w-auto" />
      <span
        className={cn(
          'rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase',
          tone === 'light' ? 'bg-white/10 text-brand-300' : 'bg-brand-50 text-brand-700',
        )}
      >
        Consola
      </span>
    </div>
  )
}
