import { useEffect, useState } from 'react'
import type { ApiQuery } from '@/types/api.types'

interface QueryState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

/**
 * Runs `fetcher` on mount and on `reload`. `fetcher` must be a stable reference (module-level function or useCallback).
 * With `refreshMs` it also reloads on that interval, keeping the current data on screen meanwhile.
 * Authentication failures are handled by the HTTP client, which ends the session.
 */
export function useApiQuery<T>(fetcher: (signal: AbortSignal) => Promise<T>, refreshMs?: number): ApiQuery<T> {
  const [state, setState] = useState<QueryState<T>>({ data: null, isLoading: true, error: null })
  const [version, setVersion] = useState(0)

  // A different fetcher means a different question (another system, another user): drop the old answer
  // right away instead of showing it until the new one arrives.
  const [currentFetcher, setCurrentFetcher] = useState(() => fetcher)
  if (currentFetcher !== fetcher) {
    setCurrentFetcher(() => fetcher)
    setState({ data: null, isLoading: true, error: null })
  }

  useEffect(() => {
    const controller = new AbortController()
    fetcher(controller.signal).then(
      (data) => setState({ data, isLoading: false, error: null }),
      () => {
        if (controller.signal.aborted) return
        setState((current) => ({ ...current, isLoading: false, error: 'No se pudo cargar la información.' }))
      },
    )
    return () => controller.abort()
  }, [fetcher, version])

  useEffect(() => {
    if (!refreshMs) return
    const timer = window.setInterval(() => setVersion((current) => current + 1), refreshMs)
    return () => window.clearInterval(timer)
  }, [refreshMs])

  return { ...state, reload: () => setVersion((current) => current + 1) }
}
