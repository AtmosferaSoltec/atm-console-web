import { useParams } from 'react-router-dom'
import { BackLink } from '@/components/common/BackLink'
import { NotFoundCard } from '@/components/common/NotFoundCard'
import { ROUTES } from '@/config/routes'
import { ClientAccountDetail, useCollectionClient } from '@/features/collections'

export function CollectionsClientDetailPage() {
  const { clientId = '' } = useParams()
  const { client, isLoading, reload } = useCollectionClient(clientId)

  return (
    <>
      <BackLink to={ROUTES.collections.clients} label="Clientes" />
      {isLoading && !client ? (
        <p className="py-10 text-center text-sm text-slate-500">Cargando cliente...</p>
      ) : client ? (
        <ClientAccountDetail client={client} onChanged={reload} />
      ) : (
        <NotFoundCard message="No encontramos este cliente." />
      )}
    </>
  )
}
