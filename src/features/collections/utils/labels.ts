import type { SelectOption } from '@/types/ui.types'
import type { AccountStatus, ChargeStatus, Currency, Periodicity } from '../types/collections.types'

export const CURRENCY_LABELS: Record<Currency, string> = {
  PEN: 'Soles (S/)',
  USD: 'Dólares (US$)',
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  PEN: 'S/',
  USD: 'US$',
}

export const PERIODICITY_LABELS: Record<Periodicity, string> = {
  monthly: 'Mensual (cada 30 días)',
  yearly: 'Anual',
}

export const CHARGE_STATUS_LABELS: Record<ChargeStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
}

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  current: 'Al día',
  pending: 'Con saldo',
}

export const CURRENCY_OPTIONS: SelectOption[] = (Object.keys(CURRENCY_LABELS) as Currency[]).map((value) => ({ value, label: CURRENCY_LABELS[value] }))
export const PERIODICITY_OPTIONS: SelectOption[] = (Object.keys(PERIODICITY_LABELS) as Periodicity[]).map((value) => ({ value, label: PERIODICITY_LABELS[value] }))

export const ACCOUNT_STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Todos los estados' },
  ...(Object.keys(ACCOUNT_STATUS_LABELS) as AccountStatus[]).map((value) => ({ value, label: ACCOUNT_STATUS_LABELS[value] })),
]
