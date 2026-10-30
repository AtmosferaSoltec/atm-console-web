import { Clock } from 'lucide-react'
import { useParams } from 'react-router-dom'
import {
  BlockedNotice,
  ConnectedNotice,
  ConnectSteps,
  InvalidLinkNotice,
  LoadingNotice,
  QrExpiredNotice,
  QrFrame,
  QrRefreshHint,
  ServerErrorNotice,
  useConnectSession,
} from '@/features/connect'
import { PublicLayout } from '@/layouts/PublicLayout'
import { formatRemaining } from '@/utils/format'

/** Public page: a customer opens the link they were sent and scans the QR with their phone. */
export function ConnectPage() {
  const { token = '' } = useParams()
  const { state, info, qr, retry } = useConnectSession(token)
  const label = info?.label ?? ''

  return (
    <PublicLayout>
      {state === 'loading' && <LoadingNotice />}
      {state === 'invalid' && <InvalidLinkNotice />}
      {state === 'error' && <ServerErrorNotice />}
      {state === 'blocked' && <BlockedNotice />}
      {state === 'retry' && <QrExpiredNotice onRetry={retry} />}
      {state === 'connected' && <ConnectedNotice label={label} />}

      {state === 'waiting' && info && (
        <>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              <span className="size-1.5 animate-pulse rounded-full bg-brand-500" />
              Vincular WhatsApp
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Conecta el WhatsApp de <span className="text-brand-700">{label}</span>
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              Escanea el código con tu celular para empezar a enviar mensajes desde tu número.
            </p>
          </div>

          <div className="mt-8">
            <QrFrame value={qr} />
            <QrRefreshHint />
          </div>

          <ConnectSteps />

          <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Clock className="size-3.5" />
            Este link vence en {formatRemaining(info.expiresAt)}
          </p>
        </>
      )}
    </PublicLayout>
  )
}
