import { useCallback } from 'react'
import { useAction } from '@/hooks/useAction'
import { useApiQuery } from '@/hooks/useApiQuery'
import { getMessage, sendMessage } from '../services/messageService'
import type { MessageStatus } from '../types/message.types'

const SEND_ERRORS: Record<string, string> = {
  session_not_connected: 'La conexión no está activa. Vincula el número primero.',
  recipient_opted_out: 'Ese destinatario se dio de baja de los mensajes promocionales.',
  invalid_recipient: 'El número de destino no es válido. Usa el formato internacional, solo dígitos.',
  request_too_large: 'El archivo es demasiado grande.',
}

export function useSendMessage() {
  return useAction(sendMessage, 'No se pudo enviar el mensaje. Intenta de nuevo.', SEND_ERRORS)
}

const PROGRESS_REFRESH_MS = 2_000
const FINAL_STATUSES: readonly MessageStatus[] = ['read', 'failed']

/** Follows one message until it is read or fails, so a test send can be watched live. */
export function useMessageProgress(messageId: string) {
  const fetcher = useCallback((signal: AbortSignal) => getMessage(messageId, signal), [messageId])
  const query = useApiQuery(fetcher, PROGRESS_REFRESH_MS)
  const isFinal = query.data !== null && FINAL_STATUSES.includes(query.data.status)
  return { message: query.data, isFinal }
}
