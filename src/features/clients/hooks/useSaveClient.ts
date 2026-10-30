import { useState } from 'react'
import { createClient, renameClient } from '../services/clientService'
import { clientErrorMessage } from './clientErrors'

export function useSaveClient() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Creates the client, or renames it when `clientId` is given. Resolves to true when it was saved. */
  const save = async (name: string, clientId?: string): Promise<boolean> => {
    setIsSaving(true)
    setError(null)
    try {
      if (clientId) await renameClient(clientId, name)
      else await createClient(name)
      return true
    } catch (caught) {
      setError(clientErrorMessage(caught, 'No se pudo guardar el cliente. Intenta de nuevo.'))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { save, isSaving, error, clearError: () => setError(null) }
}
