import { useCallback } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { getCompany, listApiKeys, listCompanies, listSeries } from '../services/companyService'
import type { Company, CompanyApiKey, CompanySeries } from '../types/company.types'

interface ListResult<T> {
  items: T[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

export function useCompanies(): ListResult<Company> {
  const { data, isLoading, error, reload } = useApiQuery(listCompanies)
  return { items: data ?? [], isLoading, error, reload }
}

export function useCompany(companyId: string | undefined) {
  const fetcher = useCallback((signal: AbortSignal) => (companyId ? getCompany(companyId, signal) : Promise.resolve(null)), [companyId])
  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return { company: data ?? null, isLoading, error, reload }
}

export function useCompanySeries(companyId: string | undefined): ListResult<CompanySeries> {
  const fetcher = useCallback((signal: AbortSignal) => (companyId ? listSeries(companyId, signal) : Promise.resolve([])), [companyId])
  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return { items: data ?? [], isLoading, error, reload }
}

export function useCompanyApiKeys(companyId: string | undefined): ListResult<CompanyApiKey> {
  const fetcher = useCallback((signal: AbortSignal) => (companyId ? listApiKeys(companyId, signal) : Promise.resolve([])), [companyId])
  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return { items: data ?? [], isLoading, error, reload }
}
