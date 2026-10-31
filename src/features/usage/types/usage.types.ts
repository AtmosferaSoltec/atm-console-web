export interface CompanyUsage {
  companyId: string
  name: string
  ruc: string
  isActive: boolean
  invoices: number
  receipts: number
  greSender: number
  greCarrier: number
  used: number
  limit: number
}

/** The usage of a month as the API sends it. */
export interface UsageResponse {
  month: string
  companies: Array<{
    company: { id: string; name: string; taxId: string }
    isActive: boolean
    limit: number
    used: number
    facturas: number
    boletas: number
    greRemitente: number
    greTransportista: number
  }>
}

export interface UsageTableProps {
  rows: CompanyUsage[]
  emptyMessage?: string
}

export interface MonthNavigationProps {
  month: Date
  onChange: (month: Date) => void
}
