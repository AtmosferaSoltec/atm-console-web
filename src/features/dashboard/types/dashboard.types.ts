import type { LucideIcon } from 'lucide-react'
import type { BadgeTone } from '@/types/ui.types'

export interface DashboardMetrics {
  servicesOnline: number
  servicesTotal: number
  messagesLast24h: number
  deliveredRate: number
  invoicesThisMonth: number
  acceptedRate: number
  storageUsedGb: number
  storageLimitGb: number
}

export type ServiceHealth = 'operational' | 'degraded' | 'down'

export interface ServiceStatus {
  id: string
  name: string
  description: string
  icon: LucideIcon
  health: ServiceHealth
  latencyMs: number
  uptimePercent: number
}

export interface HourlyActivity {
  /** Hour of the day, 0-23. */
  hour: number
  messages: number
  documents: number
}

export type AttentionSeverity = 'warning' | 'danger'

export interface AttentionItem {
  id: string
  severity: AttentionSeverity
  title: string
  detail: string
  source: string
}

export interface RecentMessage {
  id: string
  recipient: string
  system: string
  kind: string
  status: string
  statusTone: BadgeTone
  time: string
}

export interface RecentInvoice {
  id: string
  number: string
  company: string
  client: string
  total: string
  status: string
  statusTone: BadgeTone
  time: string
}

export interface DashboardData {
  metrics: DashboardMetrics
  services: ServiceStatus[]
  activity: HourlyActivity[]
  attention: AttentionItem[]
  recentMessages: RecentMessage[]
  recentInvoices: RecentInvoice[]
}

export interface ServiceStatusListProps {
  services: ServiceStatus[]
}

export interface ActivityChartProps {
  activity: HourlyActivity[]
}

export interface AttentionListProps {
  items: AttentionItem[]
}

export interface RecentActivityProps {
  messages: RecentMessage[]
  invoices: RecentInvoice[]
}
