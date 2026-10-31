import type { DocumentType } from '@/types/common.types'

/** The Nubefact account a company issues against. In TEST the documents are worth nothing before SUNAT. */
export type NubefactMode = 'TEST' | 'PRODUCTION'

export interface CompanyCounts {
  activeApiKeys: number
  series: number
  invoicesThisMonth: number
  shippingGuidesThisMonth: number
}

/** A company that issues documents through atm-nubefact-api. */
export interface Company {
  id: string
  ruc: string
  name: string
  isActive: boolean
  /** Issues against the demo account of Nubefact. */
  isTest: boolean
  nubefactUrl: string
  nubefactEmail: string | null
  /** '' when the company has no token yet. */
  nubefactTokenLast4: string
  monthlyDocumentLimit: number
  /** ISO 8601 timestamp. */
  createdAt: string
  /** Only the detail of a company carries its counts. */
  counts: CompanyCounts | null
}

export interface CompanySeries {
  id: string
  companyId: string
  documentType: DocumentType
  series: string
  lastNumber: number
  isDefault: boolean
  isActive: boolean
}

export interface CompanyApiKey {
  id: string
  label: string
  prefix: string
  /** ISO 8601 timestamp. */
  createdAt: string
  lastUsedAt: string | null
  isActive: boolean
  documentCount: number
}

export interface CompanyResponse {
  id: string
  taxId: string
  name: string
  nubefactUrl: string
  nubefactEmail: string | null
  nubefactTokenLast4: string | null
  nubefactMode: NubefactMode
  monthlyDocumentLimit: number
  isActive: boolean
  createdAt: string
  counts?: CompanyCounts
}

export interface CompanyPageResponse {
  data: CompanyResponse[]
}

export interface SeriesResponse {
  id: string
  companyId: string
  documentType: DocumentType
  series: string
  lastNumber: number
  isDefault: boolean
  isActive: boolean
}

export interface ApiKeyResponse {
  id: string
  name: string
  prefix: string
  lastUsedAt: string | null
  revokedAt: string | null
  createdAt: string
  documentCount: number
}

export interface CreateCompanyInput {
  ruc: string
  name: string
  nubefactUrl: string
  nubefactToken: string
  nubefactMode: NubefactMode
  nubefactEmail: string
}

export interface UpdateCompanyInput {
  name?: string
  nubefactUrl?: string
  /** '' clears the email. */
  nubefactEmail?: string
  monthlyDocumentLimit?: number
  isActive?: boolean
}

export interface SwitchToProductionInput {
  nubefactUrl: string
  nubefactToken: string
  nubefactEmail: string
}

export interface CreateSeriesInput {
  documentType: DocumentType
  series: string
}

export interface UpdateSeriesInput {
  isActive?: boolean
  isDefault?: boolean
  lastNumber?: number
}

/** What the connection test to Nubefact answered. It never emits anything. */
export interface NubefactTestResult {
  ok: boolean
  message: string
}

export interface CompaniesListProps {
  companies: Company[]
  isLoading: boolean
  error: string | null
}

export interface CompanySummaryProps {
  company: Company
}

/** The tabs of a company edit it and ask the page to reload it when something changed. */
export interface CompanyTabProps {
  company: Company
  onChanged: () => void
}

export interface SeriesTabProps {
  companyId: string
  series: CompanySeries[]
  isLoading: boolean
  error: string | null
  onChanged: () => void
}

export interface ApiKeysTabProps {
  companyId: string
  keys: CompanyApiKey[]
  isLoading: boolean
  error: string | null
  onChanged: () => void
}

export interface CompanyFormProps {
  onCreated: (company: Company) => void
}
