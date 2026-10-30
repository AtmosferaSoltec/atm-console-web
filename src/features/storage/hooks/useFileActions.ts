import { useState } from 'react'
import { deleteFile, getDownloadUrl } from '../services/storageService'
import type { StoredFile } from '../types/storage.types'
import { storageErrorMessage } from './storageErrors'

export function useFileActions() {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = async (file: StoredFile, action: () => Promise<void>, fallback: string): Promise<boolean> => {
    setBusyId(file.id)
    setError(null)
    try {
      await action()
      return true
    } catch (caught) {
      setError(storageErrorMessage(caught, fallback))
      return false
    } finally {
      setBusyId(null)
    }
  }

  return {
    busyId,
    error,
    clearError: () => setError(null),
    /** Asks for a signed URL and starts the browser download (the API serves it as an attachment). */
    download: (file: StoredFile) =>
      run(
        file,
        async () => {
          window.location.assign(await getDownloadUrl(file.id))
        },
        'No se pudo preparar la descarga.',
      ),
    remove: (file: StoredFile) => run(file, () => deleteFile(file.id), 'No se pudo eliminar el archivo. Intenta de nuevo.'),
  }
}
