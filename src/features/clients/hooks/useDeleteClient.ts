import { useState } from 'react'
import { deleteClient } from '../services/clientService'
import { clientErrorMessage } from './clientErrors'

export function useDeleteClient() {
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the client was deleted. */
  const remove = async (clientId: string): Promise<boolean> => {
    setError(null)
    try {
      await deleteClient(clientId)
      return true
    } catch (caught) {
      setError(clientErrorMessage(caught, 'No se pudo eliminar el cliente. Intenta de nuevo.'))
      return false
    }
  }

  return { remove, error, clearError: () => setError(null) }
}
