import type { DocumentType } from '@/types/common.types'

export interface Company {
  id: string
  ruc: string
  name: string
  isActive: boolean
  isTest: boolean
  nubefactEmail: string | null
  nubefactUrl: string
  nubefactTokenLast4: string
  monthlyDocumentLimit: number
  invoicesThisMonth: number
  guidesThisMonth: number
  activeApiKeys: number
  seriesCount: number
  createdAt: string
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
  companyId: string
  label: string
  prefix: string
  createdAt: string
  lastUsedAt: string | null
  isActive: boolean
}

export interface CompaniesListProps {
  companies: Company[]
}

export interface CompanySummaryProps {
  company: Company
}

export interface CompanyTabProps {
  company: Company
}

export interface SeriesTabProps {
  series: CompanySeries[]
}

export interface ApiKeysTabProps {
  keys: CompanyApiKey[]
}

export interface CompanyFormProps {
  onSubmit: () => void
}
