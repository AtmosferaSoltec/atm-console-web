import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { ChargesBoard, NewChargeAction, useCollectionClients } from '@/features/collections'

export function CollectionsChargesPage() {
  const { clients } = useCollectionClients()
  const [params] = useSearchParams()
  // A new cobro may create charges at once (when it started in the past): remounting the board reloads them.
  const [version, setVersion] = useState(0)
  // `?client=<id>` opens the board with that client chosen.
  const initialClientId = params.get('client')

  return (
    <>
      <PageHeader
        title="Cargos"
        description="Los cargos de todos los clientes. Elige un cliente para ver cuánto te debe y registrar su pago."
        actions={<NewChargeAction clients={clients} clientId={null} onCreated={() => setVersion((current) => current + 1)} />}
      />
      <ChargesBoard key={`${initialClientId ?? 'all'}-${version}`} initialClientId={initialClientId} />
    </>
  )
}
