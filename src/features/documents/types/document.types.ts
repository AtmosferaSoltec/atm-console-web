import type { DateRange } from 'react-day-picker'
import type { BadgeTone } from '@/types/ui.types'

export type DocumentStatus = 'PENDING' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'VOID_SUBMITTED' | 'VOIDED' | 'NEEDS_REVIEW'

/** What Nubefact keeps of a document: its page and its files. A link is null until the document has one. */
export interface DocumentLinks {
  nubefactLink: string | null
  pdfLink: string | null
  xmlLink: string | null
  cdrLink: string | null
}

export interface Invoice extends DocumentLinks {
  id: string
  documentType: 'FACTURA' | 'BOLETA'
  series: string
  number: number
  companyId: string
  companyName: string
  clientName: string
  clientDocument: string
  total: number
  currency: 'PEN' | 'USD'
  status: DocumentStatus
  isTest: boolean
  /** ISO 8601 timestamps. */
  createdAt: string
  updatedAt: string
  /** The id of the document in the system that issued it (the sale, for La Vendimia). */
  externalReference: string | null
  sunatDescription: string | null
  sunatCode: string | null
  sunatChecks: number
  lastSunatCheck: string | null
  voidReason: string | null
}

export interface ShippingGuide extends DocumentLinks {
  id: string
  documentType: 'GRE_REMITENTE' | 'GRE_TRANSPORTISTA'
  series: string
  number: number
  companyId: string
  companyName: string
  clientName: string
  clientDocument: string
  recipient: string | null
  /** YYYY-MM-DD. */
  transferDate: string
  status: DocumentStatus
  isTest: boolean
  createdAt: string
  updatedAt: string
  sunatDescription: string | null
  sunatCode: string | null
  sunatChecks: number
  lastSunatCheck: string | null
}

/** One page of a list: the API pages by number. */
export interface DocumentPage<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

interface CompanyRef {
  id: string
  name: string
}

/** The links as the API names them. */
interface LinksResponse {
  nubefactLink: string | null
  nubefactPdfLink: string | null
  nubefactXmlLink: string | null
  nubefactCdrLink: string | null
}

export interface InvoiceResponse extends LinksResponse {
  id: string
  documentType: Invoice['documentType']
  series: string
  number: number
  company: CompanyRef
  clientName: string
  clientDocumentNumber: string
  total: string
  currency: Invoice['currency']
  status: DocumentStatus
  isTest: boolean
  createdAt: string
  updatedAt: string
  externalReference: string | null
  sunatDescription: string | null
  sunatResponseCode: string | null
  sunatCheckAttempts: number
  lastSunatCheckAt: string | null
  voidReason: string | null
}

/** The list of guides carries fewer fields than a single guide: links and SUNAT checks only come with the detail. */
export interface GuideResponse extends Partial<LinksResponse> {
  id: string
  documentType: ShippingGuide['documentType']
  series: string
  number: number
  company: CompanyRef
  clientName: string
  clientDocumentNumber: string
  destinatarioDenominacion: string | null
  fechaDeInicioDeTraslado: string
  status: DocumentStatus
  isTest: boolean
  createdAt: string
  updatedAt: string
  sunatDescription: string | null
  sunatResponseCode?: string | null
  sunatCheckAttempts?: number
  lastSunatCheckAt?: string | null
}

export interface PageResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface DocumentFiltersValue {
  companyId: string
  documentType: string
  status: string
  account: string
  range: DateRange | undefined
  search: string
}

export type DocumentFiltersKind = 'invoices' | 'guides'

export interface StatusBadgeConfig {
  label: string
  tone: BadgeTone
}

export interface DocumentFiltersProps {
  kind: DocumentFiltersKind
  value: DocumentFiltersValue
  onChange: (next: DocumentFiltersValue) => void
}

export interface DocumentStatusBadgeProps {
  status: DocumentStatus
}

export interface InvoicesTableProps {
  invoices: Invoice[]
  hideCompany?: boolean
  emptyMessage?: string
}

export interface GuidesTableProps {
  guides: ShippingGuide[]
  emptyMessage?: string
}

export interface InvoiceDetailProps {
  invoice: Invoice
}

export interface GuideDetailProps {
  guide: ShippingGuide
}
