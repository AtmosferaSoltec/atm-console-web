import { useState } from 'react'
import { uploadFile } from '../services/storageService'
import type { UploadInput } from '../types/storage.types'
import { storageErrorMessage } from './storageErrors'

export function useUploadFile() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the file was stored. Uploads are not idempotent: never retry on its own. */
  const upload = async (input: UploadInput): Promise<boolean> => {
    setIsUploading(true)
    setError(null)
    try {
      await uploadFile(input)
      return true
    } catch (caught) {
      setError(storageErrorMessage(caught, 'No se pudo subir el archivo. Revisa la lista antes de reintentar.'))
      return false
    } finally {
      setIsUploading(false)
    }
  }

  return { upload, isUploading, error, clearError: () => setError(null) }
}
