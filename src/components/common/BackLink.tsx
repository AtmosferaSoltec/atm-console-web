import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { BackLinkProps } from '@/types/ui.types'

export function BackLink({ to, label }: BackLinkProps) {
  return (
    <Link to={to} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900">
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  )
}
