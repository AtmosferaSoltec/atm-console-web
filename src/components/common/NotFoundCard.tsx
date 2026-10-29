import { SearchX } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { NotFoundCardProps } from '@/types/ui.types'

export function NotFoundCard({ message }: NotFoundCardProps) {
  return (
    <Card className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <SearchX className="size-6" />
      </span>
      <p className="mt-4 text-sm font-medium text-slate-700">{message}</p>
    </Card>
  )
}
