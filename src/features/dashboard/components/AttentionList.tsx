import { ChevronRight, CircleAlert, TriangleAlert } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import type { AttentionListProps } from '../types/dashboard.types'

export function AttentionList({ items }: AttentionListProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Requiere atención</CardTitle>
          <CardDescription>{items.length} pendientes</CardDescription>
        </div>
      </CardHeader>
      <ul className="space-y-1 p-3">
        {items.map((item) => {
          const Icon = item.severity === 'danger' ? CircleAlert : TriangleAlert
          return (
            <li key={item.id}>
              <button type="button" className="group flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5 text-left transition hover:bg-slate-50">
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg',
                    item.severity === 'danger' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500',
                  )}
                >
                  <Icon className="size-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">{item.title}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {item.source} · {item.detail}
                  </span>
                </span>
                <ChevronRight className="size-4 text-slate-300 transition group-hover:text-slate-500" />
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
