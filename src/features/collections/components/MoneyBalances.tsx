import { formatMoney } from '@/utils/format'
import { CURRENCIES, hasMoney } from '../utils/balance'
import type { MoneyBalancesProps } from '../types/collections.types'

/** One line per currency; currencies are never added together. */
export function MoneyBalances({ amounts, emptyLabel = 'Sin saldo' }: MoneyBalancesProps) {
  if (!hasMoney(amounts)) return <span className="text-slate-400">{emptyLabel}</span>

  return (
    <div className="space-y-0.5">
      {CURRENCIES.filter((currency) => amounts[currency] !== 0).map((currency) => (
        <p key={currency} className="font-semibold whitespace-nowrap text-slate-900">
          {formatMoney(amounts[currency], currency)}
        </p>
      ))}
    </div>
  )
}
