import { useCallback } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { FILES_PAGE_SIZE, getPreviewUrl, getStorageSummary, listFiles } from '../services/storageService'
import type { FileFilters, StoredFile, StorageSummary } from '../types/storage.types'

interface FilesResult {
  files: StoredFile[]
  total: number
  isLoading: boolean
  error: string | null
  pageSize: number
}

/** `refreshKey` forces a reload when it changes (after an upload or a deletion). */
export function useFiles({ companyId, target, offset }: FileFilters, refreshKey: number): FilesResult {
  // refreshKey is only a dependency: a new fetcher is a new question for useApiQuery.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetcher = useCallback((signal: AbortSignal) => listFiles({ companyId, target, offset }, signal), [companyId, target, offset, refreshKey])
  const { data, isLoading, error } = useApiQuery(fetcher)
  return { files: data?.items ?? [], total: data?.total ?? 0, isLoading, error, pageSize: FILES_PAGE_SIZE }
}

interface SummaryResult {
  summary: StorageSummary | null
  isLoading: boolean
  error: string | null
}

export function useStorageSummary(): SummaryResult {
  const { data, isLoading, error } = useApiQuery(getStorageSummary)
  return { summary: data, isLoading, error }
}

interface PreviewResult {
  url: string | null
  error: string | null
}

export function usePreviewUrl(fileId: string): PreviewResult {
  const fetcher = useCallback((signal: AbortSignal) => getPreviewUrl(fileId, signal), [fileId])
  const { data, error } = useApiQuery(fetcher)
  return { url: data, error }
}
