import { useMemo } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { loadPulsoAdmin } from '../services/pulsoAdminService'
import type { CompanyDetail, PulsoAdminData, PulsoAdminQuery } from '../types/pulsoSetup.types'

/** Clients, companies, modules and people of Pulso, from auth-api and pulso-api. */
export function usePulsoAdmin(): PulsoAdminQuery {
  const { data, isLoading, error, reload } = useApiQuery(loadPulsoAdmin)
  return { data, isLoading, error, reload }
}

export function useCompanyDetail(data: PulsoAdminData | null, companyId: string | undefined): CompanyDetail | null {
  return useMemo(() => {
    const company = data?.companies.find((item) => item.id === companyId)
    const client = company && data?.clients.find((item) => item.id === company.clientId)
    if (!company || !client) return null
    return { company, client, siblings: client.companies }
  }, [data, companyId])
}
