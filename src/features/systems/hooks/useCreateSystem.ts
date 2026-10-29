import { useState } from 'react'
import { ApiError } from '@/services/httpClient'
import { createSystem } from '../services/systemService'
import type { CreateSystemInput } from '../types/system.types'

const ERROR_MESSAGES: Record<string, string> = {
  system_code_taken: 'Ya existe un sistema con ese código.',
  invalid_system_code: 'El código debe empezar con una letra minúscula.',
  invalid_system_name: 'El nombre es obligatorio.',
  invalid_session_minutes: 'Los minutos de la sesión temporal deben estar entre 5 y 1440.',
}

function createErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return ERROR_MESSAGES[error.code] ?? 'No se pudo crear el sistema. Intenta de nuevo.'
  return 'No se pudo conectar con el servidor.'
}

export function useCreateSystem() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the system was created. */
  const create = async (input: CreateSystemInput): Promise<boolean> => {
    setIsSaving(true)
    setError(null)
    try {
      await createSystem(input)
      return true
    } catch (caught) {
      setError(createErrorMessage(caught))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { create, isSaving, error, clearError: () => setError(null) }
}
