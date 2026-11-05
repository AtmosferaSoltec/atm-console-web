import { PageHeader } from '@/components/common/PageHeader'
import { ClientAccountsList, CollectionsSummaryCards, NewClientAction, useCollectionClients, useCollectionsSummary } from '@/features/collections'

export function CollectionsClientsPage() {
  const { clients, isLoading, error, reload } = useCollectionClients()
  const summary = useCollectionsSummary()
  const reloadAll = () => {
    reload()
    summary.reload()
  }

  return (
    <>
      <PageHeader title="Clientes" description="Tus clientes y lo que cada uno te debe." actions={<NewClientAction onCreated={reloadAll} />} />
      <CollectionsSummaryCards summary={summary.summary} />
      <ClientAccountsList clients={clients} isLoading={isLoading} error={error} onChanged={reloadAll} />
    </>
  )
}
