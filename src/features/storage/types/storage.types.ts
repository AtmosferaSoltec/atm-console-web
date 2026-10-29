import type { LucideIcon } from 'lucide-react'

export interface Bucket {
  id: string
  name: string
  systemName: string
  filesCount: number
  sizeGb: number
  isPublic: boolean
  createdAt: string
}

export type FileKind = 'image' | 'pdf' | 'document' | 'video' | 'other'

export interface StoredFile {
  id: string
  name: string
  bucketName: string
  kind: FileKind
  size: string
  uploadedAt: string
}

export interface StorageSummary {
  usedGb: number
  limitGb: number
  filesCount: number
  bucketsCount: number
}

export interface BucketsTableProps {
  buckets: Bucket[]
}

export interface FilesTableProps {
  files: StoredFile[]
}

export interface StorageDialogProps {
  open: boolean
  onClose: () => void
}

export interface FileKindConfig {
  label: string
  icon: LucideIcon
}
