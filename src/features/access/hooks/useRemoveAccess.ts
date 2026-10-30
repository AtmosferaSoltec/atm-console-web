import { useState } from 'react'
import { removeAccess } from '../services/accessService'
import { accessErrorMessage } from './accessErrors'

export function useRemoveAccess() {
  const [isRemoving, setIsRemoving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the access was removed. */
  const remove = async (accessId: string): Promise<boolean> => {
    setIsRemoving(true)
    setError(null)
    try {
      await removeAccess(accessId)
      return true
    } catch (caught) {
      setError(accessErrorMessage(caught, 'No se pudo quitar el acceso. Intenta de nuevo.'))
      return false
    } finally {
      setIsRemoving(false)
    }
  }

  return { remove, isRemoving, error }
}
