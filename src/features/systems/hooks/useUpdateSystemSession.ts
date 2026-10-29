import { useState } from 'react'
import { ApiError } from '@/services/httpClient'
import { updateSystemSession } from '../services/systemService'
import type { SessionPolicy } from '../types/system.types'

function updateErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'invalid_session_minutes') return 'Los minutos de la sesión temporal deben estar entre 5 y 1440.'
    return 'No se pudo guardar la sesión. Intenta de nuevo.'
  }
  return 'No se pudo conectar con el servidor.'
}

export function useUpdateSystemSession() {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the policy was saved. */
  const save = async (systemId: string, policy: SessionPolicy): Promise<boolean> => {
    setIsSaving(true)
    setSaved(false)
    setError(null)
    try {
      await updateSystemSession(systemId, policy)
      setSaved(true)
      return true
    } catch (caught) {
      setError(updateErrorMessage(caught))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { save, isSaving, saved, error, clearFeedback: () => { setSaved(false); setError(null) } }
}
