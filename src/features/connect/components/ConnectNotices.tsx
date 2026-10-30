import { Ban, Check, CircleAlert, LoaderCircle, RefreshCw, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { ConnectedNoticeProps, NoticeProps, NoticeTone } from '../types/connect.types'

const TONES: Record<NoticeTone, string> = {
  amber: 'bg-amber-50 text-amber-500',
  red: 'bg-red-50 text-red-500',
  slate: 'bg-slate-100 text-slate-400',
}

function Notice({ icon: Icon, tone, title, description, spin = false, action }: NoticeProps) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
      <span className={cn('flex size-16 items-center justify-center rounded-full', TONES[tone])}>
        <Icon className={cn('size-8', spin && 'animate-spin')} />
      </span>
      <h2 className="mt-5 text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      {action && (
        <Button className="mt-6" onClick={action.onClick}>
          <RefreshCw className="size-4" />
          {action.label}
        </Button>
      )}
    </div>
  )
}

export function LoadingNotice() {
  return <Notice icon={LoaderCircle} tone="slate" spin title="Un momento…" description="Estamos preparando tu conexión." />
}

export function InvalidLinkNotice() {
  return (
    <Notice
      icon={CircleAlert}
      tone="amber"
      title="Este link ya no es válido"
      description="Venció o fue reemplazado por uno nuevo. Pídele a quien te lo envió que te comparta otro link."
    />
  )
}

export function QrExpiredNotice({ onRetry }: { onRetry: () => void }) {
  return (
    <Notice
      icon={CircleAlert}
      tone="amber"
      title="El código venció"
      description="Pasó mucho tiempo sin escanearlo. Genera uno nuevo para continuar."
      action={{ label: 'Generar nuevo código', onClick: onRetry }}
    />
  )
}

export function BlockedNotice() {
  return (
    <Notice
      icon={Ban}
      tone="red"
      title="No se pudo vincular este número"
      description="WhatsApp bloqueó temporalmente este número. Contacta a quien te envió el link para resolverlo."
    />
  )
}

export function ServerErrorNotice() {
  return (
    <Notice
      icon={WifiOff}
      tone="slate"
      title="No pudimos conectarnos"
      description="Revisa tu conexión a internet e intenta recargar la página en unos segundos."
    />
  )
}

export function ConnectedNotice({ label }: ConnectedNoticeProps) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
      <span className="flex size-20 animate-pop items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30">
        <Check className="size-10" strokeWidth={3} />
      </span>
      <h2 className="mt-6 text-2xl font-semibold text-slate-900">¡Listo, quedó vinculado!</h2>
      <p className="mt-2 text-sm text-slate-500">
        El WhatsApp de <span className="font-medium text-slate-700">{label}</span> ya está conectado. Puedes cerrar esta página.
      </p>
    </div>
  )
}
