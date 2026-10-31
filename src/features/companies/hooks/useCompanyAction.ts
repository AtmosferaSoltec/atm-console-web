import { useState } from 'react'
import { ApiError } from '@/services/httpClient'

/** The API answers in Spanish; its own message is the best explanation. */
export function companyErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message
  return fallback
}

/** Runs one action at a time and keeps its error, for the buttons and dialogs of the company screens. */
export function useCompanyAction() {
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to the result, or to undefined when it failed (the error is in `error`). */
  const run = async <T>(action: () => Promise<T>, fallback = 'No se pudo completar la acción. Intenta de nuevo.'): Promise<T | undefined> => {
    setIsBusy(true)
    setError(null)
    try {
      return await action()
    } catch (caught) {
      setError(companyErrorMessage(caught, fallback))
      return undefined
    } finally {
      setIsBusy(false)
    }
  }

  return { run, isBusy, error, clearError: () => setError(null) }
}
