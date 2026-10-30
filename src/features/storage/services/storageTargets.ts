import type { FileScope, StorageTarget } from '../types/storage.types'

export const ALL_TARGET: StorageTarget = 'all'
/** Shared company assets (logos). */
export const LOGO_TARGET: StorageTarget = 'company'

const SYSTEM_PREFIX = 'system:'

export function systemTarget(code: string): StorageTarget {
  return `${SYSTEM_PREFIX}${code}`
}

export interface TargetParams {
  scope?: FileScope
  system?: string
}

export function targetParams(target: StorageTarget): TargetParams {
  if (target === LOGO_TARGET) return { scope: 'company' }
  if (target.startsWith(SYSTEM_PREFIX)) return { scope: 'system', system: target.slice(SYSTEM_PREFIX.length) }
  return {}
}
