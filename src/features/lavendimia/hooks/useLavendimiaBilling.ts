import { useCallback } from 'react'
import { listCompanies, listCompanySystems } from '@/features/companies'
import { useApiQuery } from '@/hooks/useApiQuery'
import { LAVENDIMIA_SYSTEM_CODE, type BillingByRuc } from '../types/lavendimia.types'

/**
 * For each RUC, whether La Vendimia may issue for it. The companies of the billing service are matched by RUC with
 * the ones of the auth API: they are two records of the same company.
 */
export function useLavendimiaBilling(rucs: string[]) {
  const key = [...rucs].sort().join(',')

  const fetcher = useCallback(
    async (signal: AbortSignal): Promise<BillingByRuc> => {
      const wanted = new Set(key === '' ? [] : key.split(','))
      const issuers = (await listCompanies(signal)).filter((company) => wanted.has(company.ruc))
      const grants = await Promise.all(issuers.map((issuer) => listCompanySystems(issuer.id, signal)))

      const byRuc: BillingByRuc = {}
      for (const ruc of wanted) byRuc[ruc] = { kind: 'no-issuer' }
      issuers.forEach((issuer, index) => {
        byRuc[issuer.ruc] = { kind: 'issuer', issuerId: issuer.id, allowed: grants[index].includes(LAVENDIMIA_SYSTEM_CODE) }
      })
      return byRuc
    },
    [key],
  )

  const { data, isLoading, error, reload } = useApiQuery(fetcher)
  return { billing: data ?? {}, isLoading, error, reload }
}
