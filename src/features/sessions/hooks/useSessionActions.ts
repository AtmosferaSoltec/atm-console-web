import { enableSystem } from '@/features/messaging-systems'
import type { MessagingSystem } from '@/features/messaging-systems'
import { useAction } from '@/hooks/useAction'
import { createConnectLink, createSession, deleteSession, disconnectSession } from '../services/sessionService'

const CREATE_ERRORS: Record<string, string> = {
  session_exists: 'Esa empresa ya tiene una conexión de WhatsApp.',
  invalid_account_ref: 'La referencia no es válida. Usa letras, números, guiones o puntos.',
  tenant_not_found: 'El sistema ya no existe en mensajería.',
}

export function useCreateSession() {
  // The system's record in messaging is created on the spot when it has never used the service.
  return useAction(
    async (system: MessagingSystem, accountRef: string) => {
      const tenantId = system.tenantId ?? (await enableSystem(system.code))
      return createSession(tenantId, accountRef.trim())
    },
    'No se pudo crear la conexión. Intenta de nuevo.',
    CREATE_ERRORS,
  )
}

export function useCreateConnectLink() {
  return useAction(createConnectLink, 'No se pudo generar el link. Intenta de nuevo.')
}

export function useDisconnectSession() {
  return useAction(disconnectSession, 'No se pudo desvincular el número. Intenta de nuevo.')
}

export function useDeleteSession() {
  return useAction(deleteSession, 'No se pudo eliminar la conexión. Intenta de nuevo.')
}
