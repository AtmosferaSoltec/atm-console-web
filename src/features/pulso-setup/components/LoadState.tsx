import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LoadStateProps } from '../types/pulsoSetup.types'

/** What the Pulso pages show until their data arrives, or when it could not be loaded. */
export function LoadState({ error, onRetry }: LoadStateProps) {
  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
        <p>{error} Revisa que pulso-api y auth-api estén en línea.</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw className="size-4" />
          Reintentar
        </Button>
      </div>
    )
  }
  return (
    <div role="status" className="space-y-3">
      <span className="sr-only">Cargando…</span>
      {[0, 1].map((item) => (
        <div key={item} className="h-36 animate-pulse rounded-xl bg-slate-200/60" />
      ))}
    </div>
  )
}
