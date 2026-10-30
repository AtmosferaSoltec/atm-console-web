import { useState } from 'react'
import { ApiError } from '@/services/httpClient'

interface ActionState {
  isWorking: boolean
  /** Message ready to show to the user, or null. */
  error: string | null
}

interface Action<Args extends unknown[], Result> extends ActionState {
  /** Resolves to the result, or null when the call failed (the reason is in `error`). */
  run: (...args: Args) => Promise<Result | null>
  clearError: () => void
}

/**
 * Wraps a write call (create, update, delete) with a working flag and a user-facing error.
 * `errorMessages` maps API error codes to text; any other failure uses `fallback`.
 */
export function useAction<Args extends unknown[], Result>(
  call: (...args: Args) => Promise<Result>,
  fallback: string,
  errorMessages: Record<string, string> = {},
): Action<Args, Result> {
  const [state, setState] = useState<ActionState>({ isWorking: false, error: null })

  const run = async (...args: Args): Promise<Result | null> => {
    setState({ isWorking: true, error: null })
    try {
      const result = await call(...args)
      setState({ isWorking: false, error: null })
      return result
    } catch (caught) {
      const error = caught instanceof ApiError ? (errorMessages[caught.code] ?? fallback) : 'No se pudo conectar con el servidor.'
      setState({ isWorking: false, error })
      return null
    }
  }

  return { ...state, run, clearError: () => setState((current) => ({ ...current, error: null })) }
}
