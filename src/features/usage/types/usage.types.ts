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

export interface UsageTableProps {
  rows: CompanyUsage[]
}

export interface MonthNavigationProps {
  month: Date
  onChange: (month: Date) => void
}
