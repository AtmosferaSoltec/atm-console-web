import { STORAGE_API_BASE_URL } from '@/config/env'
import { request } from '@/services/httpClient'
import type {
  DownloadResponse,
  FileFilters,
  FileListResponse,
  FilePage,
  FileResponse,
  StoredFile,
  StorageSummary,
  SummaryResponse,
  UploadInput,
} from '../types/storage.types'
import { targetParams } from './storageTargets'

export const FILES_PAGE_SIZE = 25
/** Server defaults; the API answers `file_too_large` when its configured limits are lower. */
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024
export const MAX_LOGO_BYTES = 2 * 1024 * 1024

function toStoredFile(file: FileResponse): StoredFile {
  return {
    id: file.id,
    companyId: file.company_id,
    system: file.system,
    scope: file.scope,
    filename: file.filename,
    contentType: file.content_type,
    size: file.size,
    createdAt: file.created_at,
  }
}

export async function listFiles(filters: FileFilters, signal?: AbortSignal): Promise<FilePage> {
  const params = new URLSearchParams({ limit: String(FILES_PAGE_SIZE), offset: String(filters.offset) })
  if (filters.companyId) params.set('company_id', filters.companyId)
  const { scope, system } = targetParams(filters.target)
  if (scope) params.set('scope', scope)
  if (system) params.set('system', system)
  const { items, total } = await request<FileListResponse>(`/v1/files?${params}`, { baseUrl: STORAGE_API_BASE_URL, signal })
  return { items: items.map(toStoredFile), total }
}

export async function getStorageSummary(signal?: AbortSignal): Promise<StorageSummary> {
  const summary = await request<SummaryResponse>('/v1/files/summary', { baseUrl: STORAGE_API_BASE_URL, signal })
  return {
    filesCount: summary.files_count,
    totalBytes: summary.total_bytes,
    usage: summary.usage.map((item) => ({ scope: item.scope, system: item.system, filesCount: item.files_count, totalBytes: item.total_bytes })),
  }
}

export async function uploadFile(input: UploadInput): Promise<StoredFile> {
  const { scope, system } = targetParams(input.target)
  const params = new URLSearchParams({ scope: scope ?? 'system', purpose: scope === 'company' ? 'logo' : 'file' })
  if (system) params.set('system', system)
  const formData = new FormData()
  formData.append('file', input.file)
  const file = await request<FileResponse>(`/v1/companies/${input.companyId}/files?${params}`, {
    method: 'POST',
    formData,
    baseUrl: STORAGE_API_BASE_URL,
  })
  return toStoredFile(file)
}

/** A short-lived signed URL; never store it. */
export async function getDownloadUrl(fileId: string): Promise<string> {
  const { url } = await request<DownloadResponse>(`/v1/files/${fileId}/download`, { baseUrl: STORAGE_API_BASE_URL })
  return url
}

/** A short-lived signed URL that displays the image in the browser; never store it. */
export async function getPreviewUrl(fileId: string, signal?: AbortSignal): Promise<string> {
  const { url } = await request<DownloadResponse>(`/v1/files/${fileId}/preview`, { baseUrl: STORAGE_API_BASE_URL, signal })
  return url
}

export async function deleteFile(fileId: string): Promise<void> {
  await request<void>(`/v1/files/${fileId}`, { method: 'DELETE', baseUrl: STORAGE_API_BASE_URL })
}
