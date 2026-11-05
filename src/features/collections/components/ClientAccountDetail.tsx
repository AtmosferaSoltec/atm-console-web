import { PageHeader } from '@/components/common/PageHeader'
import type { ClientAccountDetailProps } from '../types/collections.types'
import { AccountSummary } from './AccountSummary'
import { ChargesBoard } from './ChargesBoard'
import { NewChargeAction } from './NewChargeAction'

/** Admin view of one client: the summary and its charges, which can be paid from here. */
export function ClientAccountDetail({ client, onChanged }: ClientAccountDetailProps) {
  return (
    <>
      <PageHeader
        title="Cobros del cliente"
        description="Lo que se le cobra y lo que debe."
        actions={<NewChargeAction clients={[client]} clientId={client.id} onCreated={onChanged} />}
      />
      <AccountSummary client={client} />
      {/* Keyed by the number of cobros so a new one shows its charges right away. */}
      <ChargesBoard key={client.subscriptionsCount} fixedClientId={client.id} onPaid={onChanged} />
    </>
  )
}
