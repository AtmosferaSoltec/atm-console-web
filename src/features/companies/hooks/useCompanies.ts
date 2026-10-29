import { getApiKeys, getCompanies, getCompanyById, getSeries } from '../services/companyService'
import type { Company, CompanyApiKey, CompanySeries } from '../types/company.types'

export function useCompanies(): Company[] {
  return getCompanies()
}

export function useCompany(companyId: string | undefined): Company | undefined {
  return companyId ? getCompanyById(companyId) : undefined
}

export function useCompanySeries(companyId: string | undefined): CompanySeries[] {
  return companyId ? getSeries(companyId) : []
}

export function useCompanyApiKeys(companyId: string | undefined): CompanyApiKey[] {
  return companyId ? getApiKeys(companyId) : []
}
