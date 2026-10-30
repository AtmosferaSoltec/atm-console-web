import { messagingRequest } from '@/services/messagingClient'
import type {
  Attachment,
  Message,
  MessageFiltersValue,
  MessageResponse,
  MessagesPage,
  MessageStatus,
  SendMessageInput,
} from '../types/message.types'

export const EMPTY_FILTERS: MessageFiltersValue = { tenantId: 'all', status: 'all', priority: 'all', search: '' }

const MESSAGES = '/admin/v1/messages'

function toMessage(message: MessageResponse): Message {
  return {
    id: message.id,
    tenantId: message.tenant_id,
    sessionId: message.session_id,
    recipient: message.to,
    kind: message.type,
    priority: message.priority,
    status: message.status,
    attempts: message.attempts,
    error: message.error ?? null,
    createdAt: message.created_at,
  }
}

/** The API never returns message content, only who it went to and how it fared. */
export async function listMessages(filters: MessageFiltersValue, page: number, pageSize: number, signal?: AbortSignal): Promise<MessagesPage> {
  const params = new URLSearchParams({ limit: String(pageSize), offset: String(page * pageSize) })
  if (filters.tenantId !== 'all') params.set('tenant_id', filters.tenantId)
  if (filters.status !== 'all') params.set('status', filters.status)
  if (filters.priority !== 'all') params.set('priority', filters.priority)
  const search = filters.search.trim()
  if (search) params.set('q', search)

  const response = await messagingRequest<{ items: MessageResponse[]; has_more: boolean }>(`${MESSAGES}?${params}`, { signal })
  return { items: response.items.map(toMessage), hasMore: response.has_more }
}

export async function getMessage(messageId: string, signal?: AbortSignal): Promise<Message> {
  return toMessage(await messagingRequest<MessageResponse>(`${MESSAGES}/${messageId}`, { signal }))
}

function toAttachmentBody(attachment: Attachment) {
  return { filename: attachment.filename, mime_type: attachment.mimeType, content_base64: attachment.contentBase64 }
}

/** Sends through the same queue and limits as a system's message; it counts as that system's. */
export async function sendMessage(input: SendMessageInput): Promise<{ messageId: string; status: MessageStatus }> {
  const response = await messagingRequest<{ message_id: string; status: MessageStatus }>(MESSAGES, {
    method: 'POST',
    body: {
      session_id: input.sessionId,
      to: input.to,
      type: input.kind,
      body: input.body,
      priority: input.priority,
      attachment: input.attachment ? toAttachmentBody(input.attachment) : undefined,
    },
  })
  return { messageId: response.message_id, status: response.status }
}
