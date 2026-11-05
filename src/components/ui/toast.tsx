import { CheckCircle2, X, XCircle } from 'lucide-react'
import type { ToastProps } from '@/types/ui.types'
import { cn } from '@/utils/cn'

/** A message pinned to the bottom of the screen. Render it once per page and drive it with `useToast`. */
export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null
  const Icon = toast.tone === 'success' ? CheckCircle2 : XCircle

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6 sm:justify-end">
      <div
        key={toast.id}
        role={toast.tone === 'error' ? 'alert' : 'status'}
        className="pointer-events-auto flex max-w-sm animate-fade-in items-start gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-pop"
      >
        <Icon className={cn('mt-0.5 size-4 shrink-0', toast.tone === 'success' ? 'text-lime-brand' : 'text-red-400')} />
        <p className="min-w-0 flex-1 break-words">{toast.message}</p>
        <button type="button" aria-label="Cerrar aviso" onClick={onDismiss} className="-mr-1 cursor-pointer rounded p-0.5 text-slate-400 hover:text-white">
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
