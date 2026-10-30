import { RefreshCw } from 'lucide-react'

export function QrRefreshHint() {
  return (
    <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
      <RefreshCw className="size-3.5 animate-spin [animation-duration:3s]" />
      El código se renueva solo cada pocos segundos
    </p>
  )
}
