import { NUBEFACT_API_BASE_URL } from '@/config/env'
import { request } from '@/services/httpClient'
import type { CompanyUsage, UsageResponse } from '../types/usage.types'

/** The month of a usage query, as the API names it: YYYY-MM. */
export function usageMonthKey(month: Date): string {
  return `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`
}

export async function getUsage(monthKey: string, signal?: AbortSignal): Promise<CompanyUsage[]> {
  const usage = await request<UsageResponse>(`/admin/stats/usage?month=${monthKey}`, { baseUrl: NUBEFACT_API_BASE_URL, signal })
  return usage.companies.map((row) => ({
    companyId: row.company.id,
    name: row.company.name,
    ruc: row.company.taxId,
    isActive: row.isActive,
    invoices: row.facturas,
    receipts: row.boletas,
    greSender: row.greRemitente,
    greCarrier: row.greTransportista,
    used: row.used,
    limit: row.limit,
  }))
}
