export type Currency = 'PEN' | 'USD'
export type Periodicity = 'monthly' | 'yearly'
/** A charge is paid whole or not at all: there are no partial payments. */
export type ChargeStatus = 'pending' | 'paid'
/** 'pending' while the client owes something. */
export type AccountStatus = 'current' | 'pending'

/** An amount per currency, in soles or dollars (not cents). Currencies are never added together nor converted. */
export type MoneyByCurrency = Record<Currency, number>

// --- API responses (atm-billing-api). Amounts travel in cents.

export interface MoneyResponse {
  PEN: number
  USD: number
}

export interface CollectionClientResponse {
  id: string
  name: string
  ruc: string | null
  balance: MoneyResponse
  last_payment_on: string | null
  status: AccountStatus
  subscriptions_count: number
  statement_token: string
  created_at: string
}

export interface CollectionClientListResponse {
  items: CollectionClientResponse[]
}

export interface ChargeResponse {
  id: string
  client_id: string
  client_name: string
  subscription_id: string
  concept: string
  period: string
  billed_on: string
  amount_cents: number
  currency: Currency
  status: ChargeStatus
  paid_on: string | null
}

export interface ChargeListResponse {
  items: ChargeResponse[]
}

export interface SummaryResponse {
  month: string
  receivable: MoneyResponse
  collected_this_month: MoneyResponse
  clients_with_balance: number
  clients_total: number
}

export interface PaymentResponse {
  id: string
  client_id: string
  paid_on: string
  charge_ids: string[]
  total: MoneyResponse
}

export interface StatementChargeResponse {
  concept: string
  period: string
  billed_on: string
  amount_cents: number
  currency: Currency
  status: ChargeStatus
  paid_on: string | null
}

export interface StatementResponse {
  client: { name: string; ruc: string | null }
  balance: MoneyResponse
  charges: StatementChargeResponse[]
}

// --- What the screens use.

export interface CollectionClient {
  id: string
  name: string
  /** The RUC is optional: never assume it is there. */
  ruc: string | null
  balance: MoneyByCurrency
  /** ISO date (yyyy-mm-dd), or null when it never paid. */
  lastPaymentOn: string | null
  status: AccountStatus
  subscriptionsCount: number
  /** Secret of the public link where the client sees its statement. */
  statementToken: string
}

export interface Charge {
  id: string
  clientId: string
  clientName: string
  concept: string
  /** '2026-10' for a monthly charge, '2026' for a yearly one. */
  period: string
  amount: number
  currency: Currency
  status: ChargeStatus
  /** ISO date (yyyy-mm-dd) of the payment, or null while pending. */
  paidOn: string | null
}

export interface CollectionsSummary {
  receivable: MoneyByCurrency
  collectedThisMonth: MoneyByCurrency
  clientsWithBalance: number
  clientsTotal: number
}

export interface StatementCharge {
  concept: string
  period: string
  amount: number
  currency: Currency
  status: ChargeStatus
}

export interface Statement {
  clientName: string
  ruc: string | null
  balance: MoneyByCurrency
  charges: StatementCharge[]
}

export interface NewSubscriptionInput {
  clientId: string
  concept: string
  amount: number
  currency: Currency
  periodicity: Periodicity
  startDate: Date
}

export interface NewPaymentInput {
  clientId: string
  chargeIds: string[]
  paidOn: Date
}

// --- Component props.

export interface MoneyBalancesProps {
  amounts: MoneyByCurrency
  /** Shown when every currency is zero. */
  emptyLabel?: string
}

export interface ChargeStatusBadgeProps {
  status: ChargeStatus
}

export interface AccountStatusBadgeProps {
  status: AccountStatus
}

export interface CollectionsSummaryCardsProps {
  summary: CollectionsSummary | null
}

export interface ClientAccountsListProps {
  clients: CollectionClient[]
  isLoading: boolean
  error: string | null
  /** Called after a "cobro" was created from a row, so the list can reload. */
  onChanged: () => void
}

export interface ClientAccountDetailProps {
  client: CollectionClient
  onChanged: () => void
}

export interface AccountSummaryProps {
  client: CollectionClient
}

/** A row of the charges table: what the board and the public statement have in common. */
export interface ChargeRow {
  id: string
  concept: string
  period: string
  amount: number
  currency: Currency
  status: ChargeStatus
  clientId?: string
  clientName?: string
}

/** Row checkboxes of the charges table. */
export interface ChargeSelection {
  selected: Set<string>
  onToggle: (chargeId: string) => void
  onToggleAll: (checked: boolean) => void
}

export interface ChargesTableProps {
  charges: ChargeRow[]
  emptyMessage: string
  /** Shows a "Cliente" column with a link to each client. */
  showClient?: boolean
  /** When given, each row gets a checkbox. */
  selection?: ChargeSelection
  /** Oldest period first (for what is owed) instead of newest first. */
  oldestFirst?: boolean
}

export interface ChargeFilterBarProps {
  charges: ChargeRow[]
  value: ChargeStatus
  onChange: (value: ChargeStatus) => void
}

/**
 * The charges of one client, or of every client with a filter, split in pending and paid.
 * With a client chosen, its pending charges can be paid in one go.
 */
export interface ChargesBoardProps {
  /** Shows only this client, with no client filter nor client column (the detail of a client). */
  fixedClientId?: string
  /** The client chosen when the board opens (from the URL). */
  initialClientId?: string | null
  /** Called after a payment, so the totals around the board can reload. */
  onPaid?: () => void
}

/** Asks to confirm a payment of whole charges. Mounted only while it is shown. */
export interface PaymentConfirmDialogProps {
  clientName: string
  charges: Charge[]
  isWorking: boolean
  error: string | null
  onClose: () => void
  onConfirm: (paidOn: Date) => void
}

/** Creates a "cobro" for a client. Mounted only while it is shown. */
export interface NewChargeDialogProps {
  clients: Pick<CollectionClient, 'id' | 'name'>[]
  /** The client chosen from the start, when the dialog is opened from a client. */
  clientId: string | null
  onClose: () => void
  onCreated: () => void
}

export interface NewChargeActionProps {
  clients: Pick<CollectionClient, 'id' | 'name'>[]
  clientId: string | null
  /** A smaller button, for a table row. */
  compact?: boolean
  onCreated: () => void
}

/** Adds a client, with its name only. Mounted only while it is shown. */
export interface CollectionClientDialogProps {
  onClose: () => void
  onCreated: () => void
}

export interface NewClientActionProps {
  onCreated: () => void
}

export interface ClientStatementProps {
  token: string
}
