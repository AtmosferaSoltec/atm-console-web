import { useState } from 'react'
import { assignAccess } from '../services/accessService'
import type { AssignAccessInput } from '../types/access.types'
import { accessErrorMessage } from './accessErrors'

export function useAssignAccess() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the access was assigned. */
  const assign = async (input: AssignAccessInput): Promise<boolean> => {
    setIsSaving(true)
    setError(null)
    try {
      await assignAccess(input)
      return true
    } catch (caught) {
      setError(accessErrorMessage(caught, 'No se pudo asignar el acceso. Intenta de nuevo.'))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { assign, isSaving, error, clearError: () => setError(null) }
}
