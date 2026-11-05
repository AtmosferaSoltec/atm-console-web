import { CalendarCheck, TriangleAlert, Wallet } from 'lucide-react'
import { StatCard } from '@/components/common/StatCard'
import { formatMoney } from '@/utils/format'
import type { CollectionsSummaryCardsProps } from '../types/collections.types'

/** Totals of every client. While loading (or on error) the values show a dash. */
export function CollectionsSummaryCards({ summary }: CollectionsSummaryCardsProps) {
  const money = (amount: number | undefined, currency: 'PEN' | 'USD') => (amount === undefined ? '—' : formatMoney(amount, currency))

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Por cobrar en soles" value={money(summary?.receivable.PEN, 'PEN')} hint="Saldo pendiente de todos los clientes" icon={Wallet} />
      <StatCard label="Por cobrar en dólares" value={money(summary?.receivable.USD, 'USD')} hint="Saldo pendiente de todos los clientes" icon={Wallet} tone="sky" />
      <StatCard
        label="Clientes con saldo"
        value={summary ? `${summary.clientsWithBalance} de ${summary.clientsTotal}` : '—'}
        hint={summary?.clientsWithBalance === 0 ? 'Todos están al día' : 'Tienen cargos sin pagar'}
        icon={TriangleAlert}
        tone="red"
      />
      <StatCard
        label="Cobros del mes"
        value={money(summary?.collectedThisMonth.PEN, 'PEN')}
        hint={summary ? `y ${formatMoney(summary.collectedThisMonth.USD, 'USD')} en dólares` : 'Lo cobrado este mes'}
        icon={CalendarCheck}
        tone="violet"
      />
    </div>
  )
}
