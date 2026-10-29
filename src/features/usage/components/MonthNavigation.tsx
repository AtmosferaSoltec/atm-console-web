import { addMonths, format, isSameMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { MonthNavigationProps } from '../types/usage.types'

export function MonthNavigation({ month, onChange }: MonthNavigationProps) {
  const isCurrent = isSameMonth(month, new Date())

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" aria-label="Mes anterior" onClick={() => onChange(addMonths(month, -1))}>
        <ChevronLeft className="size-4" />
      </Button>
      <span className="w-36 text-center text-sm font-medium text-slate-900 capitalize">{format(month, 'MMMM yyyy', { locale: es })}</span>
      <Button variant="outline" size="icon" aria-label="Mes siguiente" disabled={isCurrent} onClick={() => onChange(addMonths(month, 1))}>
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
