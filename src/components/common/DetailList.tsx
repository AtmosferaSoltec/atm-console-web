import { ExternalLink as ExternalLinkIcon } from 'lucide-react'
import type { DetailListProps, ExternalLinkProps } from '@/types/ui.types'

export function DetailList({ items }: DetailListProps) {
  return (
    <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[max-content_1fr]">
      {items.map(({ label, value }) => (
        <div key={label} className="contents">
          <dt className="text-slate-500">{label}</dt>
          <dd className="break-words text-slate-900">{value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  )
}

export function ExternalLink({ href, children }: ExternalLinkProps) {
  if (!href) return <span className="text-slate-400">—</span>
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-brand-700 hover:text-brand-800">
      {children}
      <ExternalLinkIcon className="size-3.5" />
    </a>
  )
}
