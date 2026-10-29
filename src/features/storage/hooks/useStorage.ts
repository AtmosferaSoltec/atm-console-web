import { getBuckets, getFiles, getStorageSummary } from '../services/storageService'
import type { Bucket, StorageSummary, StoredFile } from '../types/storage.types'

export function useBuckets(): Bucket[] {
  return getBuckets()
}

export function useFiles(): StoredFile[] {
  return getFiles()
}

export function useStorageSummary(): StorageSummary {
  return getStorageSummary()
}
