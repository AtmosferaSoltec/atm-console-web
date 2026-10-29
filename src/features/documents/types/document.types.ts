import type { DateRange } from 'react-day-picker'
import type { BadgeTone } from '@/types/ui.types'

export type DocumentStatus = 'PENDING' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'VOID_SUBMITTED' | 'VOIDED' | 'NEEDS_REVIEW'

export interface Invoice {
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
  createdAt: string
  updatedAt: string
  externalReference: string
  sunatDescription: string
  sunatCode: string
  sunatChecks: number
  lastSunatCheck: string
  voidReason: string | null
}

export interface ShippingGuide {
  id: string
  documentType: 'GRE_REMITENTE' | 'GRE_TRANSPORTISTA'
  series: string
  number: number
  companyId: string
  companyName: string
  clientName: string
  clientDocument: string
  recipient: string | null
  transferDate: string
  status: DocumentStatus
  isTest: boolean
  createdAt: string
  sunatDescription: string
  sunatCode: string
  sunatChecks: number
  lastSunatCheck: string
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
}

export interface GuidesTableProps {
  guides: ShippingGuide[]
}

export interface InvoiceDetailProps {
  invoice: Invoice
}

export interface GuideDetailProps {
  guide: ShippingGuide
}
