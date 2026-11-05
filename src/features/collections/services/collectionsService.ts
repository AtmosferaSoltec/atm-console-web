import { format } from 'date-fns'
import { BILLING_API_BASE_URL } from '@/config/env'
import { request } from '@/services/httpClient'
import type {
  Charge,
  ChargeListResponse,
  ChargeResponse,
  CollectionClient,
  CollectionClientListResponse,
  CollectionClientResponse,
  CollectionsSummary,
  MoneyByCurrency,
  MoneyResponse,
  NewPaymentInput,
  NewSubscriptionInput,
  PaymentResponse,
  Statement,
  StatementResponse,
  SummaryResponse,
} from '../types/collections.types'

const CENTS = 100
const DATE_FORMAT = 'yyyy-MM-dd'

/** The API counts in cents; the screens in soles and dollars. */
function fromCents(money: MoneyResponse): MoneyByCurrency {
  return { PEN: money.PEN / CENTS, USD: money.USD / CENTS }
}

function toClient(client: CollectionClientResponse): CollectionClient {
  return {
    id: client.id,
    name: client.name,
    ruc: client.ruc,
    balance: fromCents(client.balance),
    lastPaymentOn: client.last_payment_on,
    status: client.status,
    subscriptionsCount: client.subscriptions_count,
    statementToken: client.statement_token,
  }
}

function toCharge(charge: ChargeResponse): Charge {
  return {
    id: charge.id,
    clientId: charge.client_id,
    clientName: charge.client_name,
    concept: charge.concept,
    period: charge.period,
    amount: charge.amount_cents / CENTS,
    currency: charge.currency,
    status: charge.status,
    paidOn: charge.paid_on,
  }
}

export async function listCollectionClients(signal?: AbortSignal): Promise<CollectionClient[]> {
  const { items } = await request<CollectionClientListResponse>('/v1/clients', { baseUrl: BILLING_API_BASE_URL, signal })
  return items.map(toClient)
}

export async function getCollectionClient(clientId: string, signal?: AbortSignal): Promise<CollectionClient> {
  return toClient(await request<CollectionClientResponse>(`/v1/clients/${clientId}`, { baseUrl: BILLING_API_BASE_URL, signal }))
}

export async function createCollectionClient(name: string): Promise<CollectionClient> {
  return toClient(await request<CollectionClientResponse>('/v1/clients', { method: 'POST', body: { name }, baseUrl: BILLING_API_BASE_URL }))
}

export async function getCollectionsSummary(signal?: AbortSignal): Promise<CollectionsSummary> {
  const summary = await request<SummaryResponse>('/v1/summary', { baseUrl: BILLING_API_BASE_URL, signal })
  return {
    receivable: fromCents(summary.receivable),
    collectedThisMonth: fromCents(summary.collected_this_month),
    clientsWithBalance: summary.clients_with_balance,
    clientsTotal: summary.clients_total,
  }
}

/** Every charge, or only those of one client. */
export async function listCharges(clientId: string | null, signal?: AbortSignal): Promise<Charge[]> {
  const query = clientId ? `?${new URLSearchParams({ client_id: clientId })}` : ''
  const { items } = await request<ChargeListResponse>(`/v1/charges${query}`, { baseUrl: BILLING_API_BASE_URL, signal })
  return items.map(toCharge)
}

export async function createSubscription(input: NewSubscriptionInput): Promise<void> {
  await request<unknown>('/v1/subscriptions', {
    method: 'POST',
    baseUrl: BILLING_API_BASE_URL,
    body: {
      client_id: input.clientId,
      concept: input.concept,
      amount_cents: Math.round(input.amount * CENTS),
      currency: input.currency,
      periodicity: input.periodicity,
      start_date: format(input.startDate, DATE_FORMAT),
    },
  })
}

export async function registerPayment(input: NewPaymentInput): Promise<void> {
  await request<PaymentResponse>('/v1/payments', {
    method: 'POST',
    baseUrl: BILLING_API_BASE_URL,
    body: { client_id: input.clientId, charge_ids: input.chargeIds, paid_on: format(input.paidOn, DATE_FORMAT) },
  })
}

/** The public statement of a client: no session, only the token of its link. */
export async function getStatement(token: string, signal?: AbortSignal): Promise<Statement> {
  const statement = await request<StatementResponse>(`/v1/public/statements/${encodeURIComponent(token)}`, {
    baseUrl: BILLING_API_BASE_URL,
    auth: false,
    signal,
  })
  return {
    clientName: statement.client.name,
    ruc: statement.client.ruc,
    balance: fromCents(statement.balance),
    charges: statement.charges.map((charge) => ({
      concept: charge.concept,
      period: charge.period,
      amount: charge.amount_cents / CENTS,
      currency: charge.currency,
      status: charge.status,
    })),
  }
}
