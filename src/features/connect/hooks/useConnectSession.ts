import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '@/services/httpClient'
import { getConnectInfo, openQrStream } from '../services/connectService'
import type { ConnectInfo, ConnectPageState, ConnectSession } from '../types/connect.types'

type StreamOutcome = 'none' | 'connected' | 'retry' | 'blocked' | 'rejected'
type InfoState = { kind: 'loading' } | { kind: 'invalid' } | { kind: 'error' } | { kind: 'ready'; info: ConnectInfo }

function resolveState(info: InfoState, outcome: StreamOutcome): ConnectPageState {
  if (info.kind !== 'ready') return info.kind
  const { status } = info.info
  if (status === 'connected' || outcome === 'connected') return 'connected'
  if (status === 'banned' || outcome === 'blocked') return 'blocked'
  if (outcome === 'rejected') return 'invalid'
  if (outcome === 'retry') return 'retry'
  return 'waiting'
}

export function useConnectSession(token: string): ConnectSession {
  const [info, setInfo] = useState<InfoState>({ kind: 'loading' })
  const [qr, setQr] = useState<string | null>(null)
  const [outcome, setOutcome] = useState<StreamOutcome>('none')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    getConnectInfo(token, controller.signal).then(
      (loaded) => setInfo({ kind: 'ready', info: loaded }),
      (error: unknown) => {
        if (controller.signal.aborted) return
        setInfo({ kind: error instanceof ApiError && error.status === 404 ? 'invalid' : 'error' })
      },
    )
    return () => controller.abort()
  }, [token])

  const status = info.kind === 'ready' ? info.info.status : undefined
  const needsQr = status !== undefined && status !== 'connected' && status !== 'banned'

  useEffect(() => {
    if (!needsQr) return
    return openQrStream(token, {
      onQr: setQr,
      onConnected: () => setOutcome('connected'),
      onClosed: (reason) => setOutcome(reason === 'banned' ? 'blocked' : 'retry'),
      onRejected: () => setOutcome('rejected'),
    })
  }, [token, needsQr, attempt])

  const retry = useCallback(() => {
    setQr(null)
    setOutcome('none')
    setAttempt((current) => current + 1)
  }, [])

  return { state: resolveState(info, outcome), info: info.kind === 'ready' ? info.info : null, qr, retry }
}
