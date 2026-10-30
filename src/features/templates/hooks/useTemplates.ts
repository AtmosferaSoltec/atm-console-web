import { useCallback, useEffect } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { getCatalog, getPreviewUrl } from '../services/templateService'
import type { Catalog } from '../types/template.types'

interface CatalogResult {
  catalog: Catalog | null
  isLoading: boolean
  error: string | null
  reload: () => void
}

export function useCatalog(): CatalogResult {
  const { data, isLoading, error, reload } = useApiQuery(getCatalog)
  return { catalog: data, isLoading, error, reload }
}

interface PreviewResult {
  url: string | null
  error: string | null
}

/** The preview PDF of a template in one format. The object URL is released when it is replaced or the caller unmounts. */
export function usePreviewUrl(code: string, format: string): PreviewResult {
  const fetcher = useCallback((signal: AbortSignal) => getPreviewUrl(code, format, signal), [code, format])
  const { data, error } = useApiQuery(fetcher)
  useEffect(() => {
    if (!data) return undefined
    return () => URL.revokeObjectURL(data)
  }, [data])
  return { url: data, error }
}
