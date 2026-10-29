import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PaginationFooterProps } from '@/types/ui.types'

export function PaginationFooter({ summary, hasPrevious, hasNext, onPrevious, onNext }: PaginationFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 text-sm text-slate-500">
      <span>{summary}</span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={!hasPrevious} onClick={onPrevious}>
          <ChevronLeft className="size-4" />
          Anterior
        </Button>
        <Button variant="outline" size="sm" disabled={!hasNext} onClick={onNext}>
          Siguiente
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
