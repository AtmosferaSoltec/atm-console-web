import { Wallet } from 'lucide-react'
import { StatCard } from '@/components/common/StatCard'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatMoney } from '@/utils/format'
import { useStatement } from '../hooks/useCollections'
import type { ChargeRow, ClientStatementProps } from '../types/collections.types'
import { CURRENCIES } from '../utils/balance'
import { CURRENCY_LABELS } from '../utils/labels'
import { formatRuc } from '../utils/period'
import { ChargesTable } from './ChargesTable'

/** Read-only statement the client opens from its link: what is left to pay and what is already paid. */
export function ClientStatement({ token }: ClientStatementProps) {
  const { statement, isLoading, error } = useStatement(token)

  if (isLoading) return <p className="py-10 text-center text-sm text-slate-500">Cargando tu estado de cuenta...</p>
  if (!statement) {
    return (
      <div className="py-6 text-center">
        <h1 className="text-xl font-semibold text-slate-900">No encontramos este estado de cuenta</h1>
        <p className="mt-2 text-sm text-slate-500">{error ? 'Revisa que el link esté completo o pide uno nuevo.' : ''}</p>
      </div>
    )
  }

  // The rows need an id for the table; the public statement has none, so the position stands in.
  const rows: ChargeRow[] = statement.charges.map((charge, index) => ({ id: String(index), ...charge }))
  const open = rows.filter((charge) => charge.status === 'pending')
  const settled = rows.filter((charge) => charge.status === 'paid')
  // Only the currencies this client is charged in.
  const currencies = CURRENCIES.filter((currency) => rows.some((charge) => charge.currency === currency))
  const ruc = formatRuc(statement.ruc)

  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-medium text-brand-700">Estado de cuenta</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight break-words text-slate-900">{statement.clientName}</h1>
        {ruc && <p className="mt-1 text-sm text-slate-500">{ruc}</p>}
      </div>

      {currencies.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {currencies.map((currency) => {
            const count = open.filter((charge) => charge.currency === currency).length
            return (
              <StatCard
                key={currency}
                label={`Saldo en ${CURRENCY_LABELS[currency].split(' ')[0].toLowerCase()}`}
                value={formatMoney(statement.balance[currency], currency)}
                hint={count === 0 ? 'Estás al día' : `${count} ${count === 1 ? 'cargo pendiente' : 'cargos pendientes'}`}
                icon={Wallet}
                tone={currency === 'PEN' ? 'brand' : 'sky'}
              />
            )
          })}
        </div>
      )}

      <Tabs defaultValue="pending">
        <Card>
          <TabsList>
            <TabsTrigger value="pending">Pendientes ({open.length})</TabsTrigger>
            <TabsTrigger value="paid">Pagados ({settled.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <ChargesTable charges={open} oldestFirst emptyMessage="No tienes cargos pendientes." />
          </TabsContent>
          <TabsContent value="paid">
            <ChargesTable charges={settled} emptyMessage="Todavía no hay cargos pagados." />
          </TabsContent>
        </Card>
      </Tabs>
    </>
  )
}
