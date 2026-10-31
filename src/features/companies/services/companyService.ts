import { NUBEFACT_API_BASE_URL } from '@/config/env'
import { request } from '@/services/httpClient'
import type {
  ApiKeyResponse,
  Company,
  CompanyApiKey,
  CompanyPageResponse,
  CompanyResponse,
  CompanySeries,
  CreateCompanyInput,
  CreateSeriesInput,
  NubefactTestResult,
  SeriesResponse,
  SwitchToProductionInput,
  UpdateCompanyInput,
  UpdateSeriesInput,
} from '../types/company.types'

const PATH = '/admin'
const BASE = { baseUrl: NUBEFACT_API_BASE_URL }
/** The API pages its lists; there are few companies, so one big page is the whole list. */
const ALL = 'pageSize=100'

function toCompany(company: CompanyResponse): Company {
  return {
    id: company.id,
    ruc: company.taxId,
    name: company.name,
    isActive: company.isActive,
    isTest: company.nubefactMode === 'TEST',
    nubefactUrl: company.nubefactUrl,
    nubefactEmail: company.nubefactEmail,
    nubefactTokenLast4: company.nubefactTokenLast4 ?? '',
    monthlyDocumentLimit: company.monthlyDocumentLimit,
    createdAt: company.createdAt,
    counts: company.counts ?? null,
  }
}

function toSeries(series: SeriesResponse): CompanySeries {
  return {
    id: series.id,
    companyId: series.companyId,
    documentType: series.documentType,
    series: series.series,
    lastNumber: series.lastNumber,
    isDefault: series.isDefault,
    isActive: series.isActive,
  }
}

function toApiKey(key: ApiKeyResponse): CompanyApiKey {
  return {
    id: key.id,
    label: key.name,
    prefix: key.prefix,
    createdAt: key.createdAt,
    lastUsedAt: key.lastUsedAt,
    isActive: key.revokedAt === null,
    documentCount: key.documentCount,
  }
}

export async function listCompanies(signal?: AbortSignal): Promise<Company[]> {
  const { data } = await request<CompanyPageResponse>(`${PATH}/companies?${ALL}`, { ...BASE, signal })
  return data.map(toCompany)
}

export async function getCompany(companyId: string, signal?: AbortSignal): Promise<Company> {
  return toCompany(await request<CompanyResponse>(`${PATH}/companies/${companyId}`, { ...BASE, signal }))
}

export async function createCompany(input: CreateCompanyInput): Promise<Company> {
  const company = await request<CompanyResponse>(`${PATH}/companies`, {
    ...BASE,
    method: 'POST',
    body: {
      taxId: input.ruc,
      name: input.name,
      nubefactUrl: input.nubefactUrl,
      nubefactToken: input.nubefactToken,
      nubefactMode: input.nubefactMode,
      ...(input.nubefactEmail ? { nubefactEmail: input.nubefactEmail } : {}),
    },
  })
  return toCompany(company)
}

export async function updateCompany(companyId: string, input: UpdateCompanyInput): Promise<Company> {
  const { nubefactEmail, ...rest } = input
  const company = await request<CompanyResponse>(`${PATH}/companies/${companyId}`, {
    ...BASE,
    method: 'PATCH',
    // The API clears the email with null.
    body: { ...rest, ...(nubefactEmail === undefined ? {} : { nubefactEmail: nubefactEmail === '' ? null : nubefactEmail }) },
  })
  return toCompany(company)
}

export async function replaceNubefactToken(companyId: string, nubefactToken: string): Promise<Company> {
  return toCompany(await request<CompanyResponse>(`${PATH}/companies/${companyId}/nubefact-token`, { ...BASE, method: 'PUT', body: { nubefactToken } }))
}

/** Only from the demo account: there is no way back. */
export async function switchToProduction(companyId: string, input: SwitchToProductionInput): Promise<Company> {
  const company = await request<CompanyResponse>(`${PATH}/companies/${companyId}/nubefact-production`, {
    ...BASE,
    method: 'POST',
    body: { nubefactUrl: input.nubefactUrl, nubefactToken: input.nubefactToken, ...(input.nubefactEmail ? { nubefactEmail: input.nubefactEmail } : {}) },
  })
  return toCompany(company)
}

export async function testNubefactConnection(companyId: string): Promise<NubefactTestResult> {
  return request<NubefactTestResult>(`${PATH}/companies/${companyId}/nubefact-test`, { ...BASE, method: 'POST' })
}

export async function listSeries(companyId: string, signal?: AbortSignal): Promise<CompanySeries[]> {
  const series = await request<SeriesResponse[]>(`${PATH}/companies/${companyId}/series`, { ...BASE, signal })
  return series.map(toSeries)
}

export async function createSeries(companyId: string, input: CreateSeriesInput): Promise<CompanySeries> {
  return toSeries(await request<SeriesResponse>(`${PATH}/companies/${companyId}/series`, { ...BASE, method: 'POST', body: input }))
}

export async function updateSeries(seriesId: string, input: UpdateSeriesInput): Promise<CompanySeries> {
  return toSeries(await request<SeriesResponse>(`${PATH}/series/${seriesId}`, { ...BASE, method: 'PATCH', body: input }))
}

export async function listApiKeys(companyId: string, signal?: AbortSignal): Promise<CompanyApiKey[]> {
  const keys = await request<ApiKeyResponse[]>(`${PATH}/companies/${companyId}/api-keys`, { ...BASE, signal })
  return keys.map(toApiKey)
}

/** The key comes back in full only here, once. */
export async function createApiKey(companyId: string, name: string): Promise<string> {
  const created = await request<{ id: string; apiKey: string }>(`${PATH}/companies/${companyId}/api-keys`, { ...BASE, method: 'POST', body: { name } })
  return created.apiKey
}

export async function revokeApiKey(keyId: string): Promise<void> {
  await request<void>(`${PATH}/api-keys/${keyId}`, { ...BASE, method: 'DELETE' })
}
