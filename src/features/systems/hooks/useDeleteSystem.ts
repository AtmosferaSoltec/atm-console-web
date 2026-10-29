import { useState } from 'react'
import { ApiError } from '@/services/httpClient'
import { deleteSystem } from '../services/systemService'

const ERROR_MESSAGES: Record<string, string> = {
  code_mismatch: 'El código no coincide con el del sistema.',
  system_not_found: 'Este sistema ya no existe.',
}

function deleteErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return ERROR_MESSAGES[error.code] ?? 'No se pudo eliminar el sistema. Intenta de nuevo.'
  return 'No se pudo conectar con el servidor.'
}

export function useDeleteSystem() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the system was deleted. */
  const remove = async (systemId: string, confirmCode: string): Promise<boolean> => {
    setIsDeleting(true)
    setError(null)
    try {
      await deleteSystem(systemId, confirmCode)
      return true
    } catch (caught) {
      setError(deleteErrorMessage(caught))
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return { remove, isDeleting, error, clearError: () => setError(null) }
}
