import { Paperclip, Send } from 'lucide-react'
import { useRef, useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useSessions } from '@/features/sessions'
import { cn } from '@/utils/cn'
import { fileToBase64 } from '@/utils/files'
import { formatBytes } from '@/utils/format'
import { useSendMessage } from '../hooks/useSendMessage'
import type { MessageKind, MessagePriority, SendMessageDialogProps } from '../types/message.types'
import { KIND_OPTIONS } from './MessageBadges'
import { MessageProgress } from './MessageProgress'

/** Largest attachment the API accepts. */
const MAX_ATTACHMENT_BYTES = 16 * 1024 * 1024

export function SendMessageDialog({ open, onClose, initialSessionId }: SendMessageDialogProps) {
  const { sessions } = useSessions()
  const connected = sessions.filter((session) => session.status === 'connected')
  const send = useSendMessage()
  const [sessionId, setSessionId] = useState(initialSessionId ?? '')
  const [to, setTo] = useState('')
  const [kind, setKind] = useState<MessageKind>('text')
  const [priority, setPriority] = useState<MessagePriority>('transactional')
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [sentId, setSentId] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const option = KIND_OPTIONS.find((candidate) => candidate.value === kind) ?? KIND_OPTIONS[0]
  const isText = kind === 'text'
  const selectedSession = sessionId || connected[0]?.id || ''
  const canSend = selectedSession !== '' && to.trim() !== '' && (isText ? body.trim() !== '' : file !== null) && fileError === null

  const reset = () => {
    setTo('')
    setBody('')
    setFile(null)
    setFileError(null)
    setSentId(null)
    send.clearError()
  }

  const close = () => {
    reset()
    onClose()
  }

  const handleKind = (next: MessageKind) => {
    setKind(next)
    setFile(null)
    setFileError(null)
  }

  const handleFile = (selected: File | undefined) => {
    setFile(selected ?? null)
    setFileError(selected && selected.size > MAX_ATTACHMENT_BYTES ? `El archivo pesa ${formatBytes(selected.size)} y el límite es 16 MB.` : null)
  }

  const handleSend = async () => {
    const attachment = file ? { filename: file.name, mimeType: file.type, contentBase64: await fileToBase64(file) } : undefined
    const sent = await send.run({ sessionId: selectedSession, to: to.replace(/\D/g, ''), kind, body: body.trim(), priority, attachment })
    if (sent) setSentId(sent.messageId)
  }

  if (sentId) {
    return (
      <Dialog
        open={open}
        onClose={close}
        size="lg"
        title="Mensaje enviado a la cola"
        description="Aquí ves cómo avanza en WhatsApp."
        footer={
          <>
            <Button variant="outline" onClick={reset}>
              Enviar otro
            </Button>
            <Button onClick={close}>Listo</Button>
          </>
        }
      >
        <div className="py-3">
          <MessageProgress messageId={sentId} />
        </div>
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
          <Button onClick={handleSend} disabled={!canSend || send.isWorking}>
            <Send className="size-4" />
            {send.isWorking ? 'Enviando...' : 'Enviar'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Enviar desde" htmlFor="send-session">
            <Select
              id="send-session"
              value={selectedSession}
              onValueChange={setSessionId}
              placeholder="Elige una conexión"
              options={connected.map((session) => ({ value: session.id, label: `${session.accountRef} · ${session.clientName}` }))}
            />
          </FormField>
          <FormField label="Número de destino" htmlFor="send-to">
            <Input id="send-to" inputMode="tel" placeholder="51936416623" value={to} onChange={(event) => setTo(event.target.value)} />
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
                onClick={() => handleKind(value)}
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
            <input
              key={kind}
              ref={fileInput}
              type="file"
              accept={option.accept}
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 px-4 py-3.5 text-left transition hover:bg-slate-50"
            >
              <Paperclip className="size-5 shrink-0 text-slate-400" />
              <span className="text-sm">
                <span className="block text-slate-600">{file ? file.name : 'Haz clic para elegir un archivo'}</span>
                <span className="text-xs text-slate-400">{file ? formatBytes(file.size) : `${option.hint} · máximo 16 MB`}</span>
              </span>
            </button>
            {fileError && <p className="mt-1.5 text-xs text-red-600">{fileError}</p>}
          </div>
        )}

        {kind !== 'audio' && (
          <FormField label={isText ? 'Mensaje' : 'Texto que acompaña (opcional)'} htmlFor="send-body">
            <Textarea
              id="send-body"
              placeholder={isText ? 'Escribe tu mensaje de prueba…' : 'Pie de foto, comentario…'}
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </FormField>
        )}

        <FormField label="Prioridad" htmlFor="send-priority">
          <Select
            id="send-priority"
            value={priority}
            onValueChange={(value) => setPriority(value as MessagePriority)}
            options={[
              { value: 'transactional', label: 'Transaccional (sale enseguida)' },
              { value: 'promotional', label: 'Promocional (con retraso y límite diario)' },
            ]}
          />
        </FormField>
        {send.error && <p className="text-sm text-red-600">{send.error}</p>}
      </div>
    </Dialog>
  )
}
