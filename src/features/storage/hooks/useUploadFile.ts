import { useState } from 'react'
import { uploadFile } from '../services/storageService'
import type { StoredFile, UploadInput } from '../types/storage.types'
import { storageErrorMessage } from './storageErrors'

export function useUploadFile() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to the stored file, or null on failure. Uploads are not idempotent: never retry on its own. */
  const upload = async (input: UploadInput): Promise<StoredFile | null> => {
    setIsUploading(true)
    setError(null)
    try {
      return await uploadFile(input)
    } catch (caught) {
      setError(storageErrorMessage(caught, 'No se pudo subir el archivo. Revisa la lista antes de reintentar.'))
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return { upload, isUploading, error, clearError: () => setError(null) }
}
