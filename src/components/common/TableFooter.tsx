import type { TableFooterProps } from '@/types/ui.types'

export function TableFooter({ shown, total, noun }: TableFooterProps) {
  return (
    <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
      Mostrando {shown} de {total} {noun}
    </div>
  )
}
