import { FileText, Image as ImageIcon, MessageSquareText, Music, Video } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { KindOption, MessageKind, MessagePriority, MessageStatus, StatusBadgeConfig } from '../types/message.types'

export const STATUS_BADGES: Record<MessageStatus, StatusBadgeConfig> = {
  queued: { label: 'En cola', tone: 'neutral' },
  sending: { label: 'Enviando', tone: 'info' },
  sent: { label: 'Enviado', tone: 'info' },
  delivered: { label: 'Entregado', tone: 'success' },
  read: { label: 'Leído', tone: 'violet' },
  failed: { label: 'Falló', tone: 'danger' },
}

const ERROR_LABELS: Record<string, string> = {
  recipient_not_on_channel: 'El número no tiene WhatsApp',
  send_failed: 'Falló tras varios intentos',
  expired: 'Expiró en la cola',
  session_not_connected: 'Conexión caída',
  recipient_opted_out: 'El destinatario se dio de baja',
}

export const KIND_OPTIONS: KindOption[] = [
  { value: 'text', label: 'Texto', icon: MessageSquareText, hint: '', accept: '' },
  { value: 'image', label: 'Imagen', icon: ImageIcon, hint: 'JPG, PNG o WebP', accept: 'image/jpeg,image/png,image/webp' },
  { value: 'video', label: 'Video', icon: Video, hint: 'MP4', accept: 'video/mp4' },
  { value: 'audio', label: 'Audio', icon: Music, hint: 'MP3 u OGG', accept: 'audio/mpeg,audio/ogg' },
  { value: 'document', label: 'Documento', icon: FileText, hint: 'PDF, Word, Excel, PowerPoint, TXT o CSV', accept: '.pdf,.txt,.csv,.docx,.xlsx,.pptx' },
]

export function MessageStatusBadge({ status }: { status: MessageStatus }) {
  const { label, tone } = STATUS_BADGES[status]
  return <Badge tone={tone}>{label}</Badge>
}

export function MessagePriorityBadge({ priority }: { priority: MessagePriority }) {
  return (
    <Badge tone={priority === 'promotional' ? 'warning' : 'neutral'} dot={false}>
      {priority === 'promotional' ? 'Promocional' : 'Transaccional'}
    </Badge>
  )
}

export function MessageKindLabel({ kind }: { kind: MessageKind }) {
  const { label, icon: Icon } = KIND_OPTIONS.find((option) => option.value === kind) ?? KIND_OPTIONS[0]
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-600">
      <Icon className="size-4 text-slate-400" />
      {label}
    </span>
  )
}

export function describeMessageError(code: string): string {
  return ERROR_LABELS[code] ?? code
}
