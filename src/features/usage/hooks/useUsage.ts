import { getUsage } from '../services/usageService'
import type { CompanyUsage } from '../types/usage.types'

export function useUsage(): CompanyUsage[] {
  return getUsage()
}
