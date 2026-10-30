import { Check, CircleAlert, Clock3 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useMessageProgress } from '../hooks/useSendMessage'
import type { MessageProgressProps, MessageStatus } from '../types/message.types'
import { describeMessageError } from './MessageBadges'

interface Step {
  label: string
  /** Statuses at which this step is already reached. */
  reachedAt: readonly MessageStatus[]
}

const STEPS: Step[] = [
  { label: 'En cola', reachedAt: ['queued', 'sending', 'sent', 'delivered', 'read'] },
  { label: 'Enviado', reachedAt: ['sent', 'delivered', 'read'] },
  { label: 'Entregado', reachedAt: ['delivered', 'read'] },
  { label: 'Leído', reachedAt: ['read'] },
]

export function MessageProgress({ messageId }: MessageProgressProps) {
  const { message } = useMessageProgress(messageId)
  const status = message?.status ?? 'queued'
  const failed = status === 'failed'

  return (
    <div>
      <ol className="flex items-start">
        {STEPS.map((step, index) => {
          const reached = !failed && step.reachedAt.includes(status)
          const next = !failed && !reached && (index === 0 || STEPS[index - 1].reachedAt.includes(status))
          return (
            <li key={step.label} className="flex flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                <span className={cn('h-0.5 flex-1', index === 0 ? 'bg-transparent' : reached ? 'bg-brand-500' : 'bg-slate-200')} />
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition',
                    reached ? 'border-brand-500 bg-brand-500 text-white' : next ? 'border-brand-300 bg-white text-brand-500' : 'border-slate-200 bg-white text-slate-300',
                  )}
                >
                  {reached ? <Check className="size-4" strokeWidth={3} /> : next ? <Clock3 className="size-4 animate-pulse" /> : <span className="size-1.5 rounded-full bg-slate-300" />}
                </span>
                <span
                  className={cn('h-0.5 flex-1', index === STEPS.length - 1 ? 'bg-transparent' : reached && STEPS[index + 1].reachedAt.includes(status) ? 'bg-brand-500' : 'bg-slate-200')}
                />
              </div>
              <span className={cn('mt-2 text-xs font-medium', reached ? 'text-slate-900' : 'text-slate-400')}>{step.label}</span>
            </li>
          )
        })}
      </ol>

      {failed && (
        <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-red-50 p-3.5 text-sm text-red-700">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <span>No se pudo enviar{message?.error ? `: ${describeMessageError(message.error)}` : '.'}</span>
        </div>
      )}
      {!failed && status !== 'read' && (
        <p className="mt-5 text-center text-xs text-slate-400">Este estado se actualiza solo. Los promocionales esperan unos segundos entre mensajes.</p>
      )}
    </div>
  )
}
