import { CircleCheck, Paperclip, Send } from 'lucide-react'
import { useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useSessions } from '@/features/sessions'
import { cn } from '@/utils/cn'
import type { MessageKind, SendMessageDialogProps } from '../types/message.types'
import { KIND_OPTIONS } from './MessageBadges'

const PROGRESS_STEPS = ['En cola', 'Enviado', 'Entregado', 'Leído']

export function SendMessageDialog({ open, onClose, initialSessionId }: SendMessageDialogProps) {
  const connected = useSessions().filter((session) => session.status === 'connected')
  const [sessionId, setSessionId] = useState(initialSessionId ?? connected[0]?.id ?? '')
  const [kind, setKind] = useState<MessageKind>('text')
  const [priority, setPriority] = useState('transactional')
  const [sent, setSent] = useState(false)

  const option = KIND_OPTIONS.find((candidate) => candidate.value === kind) ?? KIND_OPTIONS[0]
  const isText = kind === 'text'

  const close = () => {
    setSent(false)
    onClose()
  }

  if (sent) {
    return (
      <Dialog
        open={open}
        onClose={close}
        size="lg"
        title="Mensaje enviado a la cola"
        description="Aquí ves cómo avanza en WhatsApp."
        footer={
          <>
            <Button variant="outline" onClick={() => setSent(false)}>
              Enviar otro
            </Button>
            <Button onClick={close}>Listo</Button>
          </>
        }
      >
        <ol className="flex items-center justify-between gap-2 py-3">
          {PROGRESS_STEPS.map((step, index) => (
            <li key={step} className="flex flex-1 flex-col items-center gap-1.5 text-xs font-medium text-slate-600">
              <span className={cn('flex size-8 items-center justify-center rounded-full', index < 2 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400')}>
                <CircleCheck className="size-4" />
              </span>
              {step}
            </li>
          ))}
        </ol>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      size="lg"
      title="Enviar mensaje de prueba"
      description="Se envía desde el WhatsApp de la conexión elegida, igual que cuando lo envía uno de tus sistemas."
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button onClick={() => setSent(true)}>
            <Send className="size-4" />
            Enviar
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Enviar desde" htmlFor="send-session">
            <Select
              id="send-session"
              value={sessionId}
              onValueChange={setSessionId}
              placeholder="Elige una conexión"
              options={connected.map((session) => ({ value: session.id, label: `${session.accountRef} · ${session.clientName}` }))}
            />
          </FormField>
          <FormField label="Número de destino" htmlFor="send-to">
            <Input id="send-to" inputMode="tel" placeholder="51936416623" />
          </FormField>
        </div>

        <div>
          <Label>Tipo de mensaje</Label>
          <div className="grid grid-cols-5 gap-2">
            {KIND_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={kind === value}
                onClick={() => setKind(value)}
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-medium transition',
                  kind === value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                )}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {!isText && (
          <div>
            <Label>Archivo</Label>
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 px-4 py-3.5">
              <Paperclip className="size-5 shrink-0 text-slate-400" />
              <span className="text-sm">
                <span className="block text-slate-600">Haz clic para elegir un archivo</span>
                <span className="text-xs text-slate-400">{option.hint} · máximo 16 MB</span>
              </span>
            </div>
          </div>
        )}

        {kind !== 'audio' && (
          <FormField label={isText ? 'Mensaje' : 'Texto que acompaña (opcional)'} htmlFor="send-body">
            <Textarea id="send-body" placeholder={isText ? 'Escribe tu mensaje de prueba…' : 'Pie de foto, comentario…'} />
          </FormField>
        )}

        <FormField label="Prioridad" htmlFor="send-priority">
          <Select
            id="send-priority"
            value={priority}
            onValueChange={setPriority}
            options={[
              { value: 'transactional', label: 'Transaccional (sale enseguida)' },
              { value: 'promotional', label: 'Promocional (con retraso y límite diario)' },
            ]}
          />
        </FormField>
      </div>
    </Dialog>
  )
}
