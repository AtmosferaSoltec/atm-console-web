import type { LucideIcon } from 'lucide-react'
import type { TenantItem } from '@/features/tenants'

export type FileScope = 'company' | 'system'

export interface FileResponse {
  id: string
  company_id: string
  system: string
  scope: FileScope
  purpose: 'logo' | 'file'
  filename: string
  content_type: string
  size: number
  created_at: string
}

export interface FileListResponse {
  items: FileResponse[]
  total: number
}

export interface UsageResponse {
  scope: FileScope
  system: string
  files_count: number
  total_bytes: number
}

export interface SummaryResponse {
  files_count: number
  total_bytes: number
  usage: UsageResponse[]
}

export interface DownloadResponse {
  url: string
  expires_at: string
}

export interface StoredFile {
  id: string
  companyId: string
  /** System code; empty for a shared company asset. */
  system: string
  scope: FileScope
  filename: string
  contentType: string
  /** Bytes. */
  size: number
  /** ISO 8601 timestamp. */
  createdAt: string
}

export interface FilePage {
  items: StoredFile[]
  total: number
}

export interface UsageItem {
  scope: FileScope
  system: string
  filesCount: number
  totalBytes: number
}

export interface StorageSummary {
  filesCount: number
  totalBytes: number
  usage: UsageItem[]
}

/** 'all', 'company' (shared company logos) or 'system:<code>' (see storageTargets.ts). */
export type StorageTarget = string

export interface FileFilters {
  /** Company UUID, or empty for every company. */
  companyId: string
  target: StorageTarget
  offset: number
}

export interface UploadInput {
  companyId: string
  /** 'company' for the company logo or 'system:<code>'. */
  target: StorageTarget
  file: File
}

export interface StorageNames {
  tenants: TenantItem[]
  isLoading: boolean
  /** Company UUID -> display name. */
  companyNames: Record<string, string>
  /** System code -> display name. */
  systemNames: Record<string, string>
}

export interface FilesTableProps {
  files: StoredFile[]
  companyNames: Record<string, string>
  systemNames: Record<string, string>
  emptyMessage: string
  /** Id of the file with an action in progress. */
  busyId: string | null
  onPreview: (file: StoredFile) => void
  onDownload: (file: StoredFile) => void
  onDelete: (file: StoredFile) => void
}

export interface FilesListProps {
  names: StorageNames
  /** Changes after an upload so the list reloads. */
  refreshKey: number
}

export interface ImagePreviewDialogProps {
  /** The image to show, or null when the dialog is closed. */
  file: StoredFile | null
  onClose: () => void
}

export interface CompanyLogoProps {
  /** Id of the logo, or '' when the company has none (a placeholder is shown). */
  fileId: string
  /** Company name, for the image description. */
  name: string
}

export interface CompanyLogoFieldProps {
  companyId: string
  /** Id of the current logo, or '' when there is none. */
  logoFileId: string
  /** Called with the id of a newly uploaded logo, or '' when it is removed. */
  onChange: (logoFileId: string) => void
  disabled?: boolean
}

export interface UsageTableProps {
  usage: UsageItem[]
  totalBytes: number
  systemNames: Record<string, string>
  emptyMessage: string
}

export interface UploadDialogProps {
  open: boolean
  onClose: () => void
  onUploaded: () => void
  tenants: TenantItem[]
}

export interface FileKindConfig {
  label: string
  icon: LucideIcon
}
