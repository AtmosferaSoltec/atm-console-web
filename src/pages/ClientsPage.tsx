import { Plus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { ClientDialog, ClientsList, useClients } from '@/features/clients'

export function ClientsPage() {
  const { clients, isLoading, error, reload } = useClients()
  const [creating, setCreating] = useState(false)

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Los dueños de las empresas. Las empresas de un mismo cliente pueden compartir datos dentro de un sistema, como los compradores."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nuevo cliente
          </Button>
        }
      />
      <ClientsList clients={clients} isLoading={isLoading} error={error} onChanged={reload} />
      <ClientDialog open={creating} client={null} onClose={() => setCreating(false)} onSaved={reload} />
    </>
  )
}
