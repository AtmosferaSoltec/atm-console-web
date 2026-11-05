import { ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'
import { CopyField } from '@/components/common/CopyField'
import { Card } from '@/components/ui/card'
import { statementPath } from '@/config/routes'
import type { AccountSummaryProps } from '../types/collections.types'
import { formatIsoDate, formatRuc } from '../utils/period'
import { AccountStatusBadge } from './CollectionBadges'
import { MoneyBalances } from './MoneyBalances'

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</p>
      <div className="mt-1 text-sm text-slate-900">{children}</div>
    </div>
  )
}

/** Header of a client: who it is, what it owes, and the link where it sees its statement. */
export function AccountSummary({ client }: AccountSummaryProps) {
  const ruc = formatRuc(client.ruc)
  const link = `${window.location.origin}${statementPath(client.statementToken)}`

  return (
    <Card className="mb-6 p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="min-w-0 text-xl font-semibold tracking-tight break-words text-slate-900">{client.name}</h2>
        <AccountStatusBadge status={client.status} />
      </div>
      {ruc && <p className="mt-1 text-sm break-words text-slate-500">{ruc}</p>}

      <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-3">
        <Fact label="Saldo pendiente">
          <MoneyBalances amounts={client.balance} emptyLabel="Sin deuda" />
        </Fact>
        <Fact label="Último pago">{formatIsoDate(client.lastPaymentOn)}</Fact>
        <Fact label="Cobros">{client.subscriptionsCount}</Fact>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">Link del estado de cuenta</p>
          <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
            Ver como cliente
            <ExternalLink className="size-3.5" />
          </a>
        </div>
        <CopyField value={link} />
        <p className="mt-1.5 text-xs text-slate-500">Envíaselo a tu cliente: verá lo que te debe y lo que ya pagó, sin iniciar sesión.</p>
      </div>
    </Card>
  )
}
