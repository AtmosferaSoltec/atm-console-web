import type { Currency, MoneyByCurrency } from '../types/collections.types'

export const CURRENCIES: Currency[] = ['PEN', 'USD']

export function hasMoney(amounts: MoneyByCurrency): boolean {
  return CURRENCIES.some((currency) => amounts[currency] !== 0)
}

/** Adds up amounts per currency; currencies are never mixed. Rounded to cents so decimals do not drift. */
export function sumByCurrency(items: { amount: number; currency: Currency }[]): MoneyByCurrency {
  const total: MoneyByCurrency = { PEN: 0, USD: 0 }
  for (const item of items) total[item.currency] = Math.round((total[item.currency] + item.amount) * 100) / 100
  return total
}
