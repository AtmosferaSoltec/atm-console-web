import { useCallback } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { getUsage, usageMonthKey } from '../services/usageService'
import type { CompanyUsage } from '../types/usage.types'

interface UsageResult {
  rows: CompanyUsage[]
  isLoading: boolean
  error: string | null
}

/** The documents each company issued in a month, against the limit of its plan. */
export function useUsage(month: Date): UsageResult {
  const monthKey = usageMonthKey(month)
  const fetcher = useCallback((signal: AbortSignal) => getUsage(monthKey, signal), [monthKey])
  const { data, isLoading, error } = useApiQuery(fetcher)
  return { rows: data ?? [], isLoading, error }
}
