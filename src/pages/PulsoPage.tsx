import { Plus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { ClientDialog } from '@/features/clients'
import { PulsoClientsList, usePulsoClients, usePulsoTeam } from '@/features/pulso'

export function PulsoPage() {
  const { clients, isLoading, error, reload } = usePulsoClients()
  const { team, isLoading: teamLoading, reload: reloadTeam } = usePulsoTeam()
  const [creating, setCreating] = useState(false)

  return (
    <>
      <PageHeader
        title="Pulso"
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nuevo cliente
          </Button>
        }
      />
      <PulsoClientsList clients={clients} team={team} isLoading={isLoading || teamLoading} error={error} onChanged={reload} onTeamChanged={reloadTeam} />
      <ClientDialog open={creating} client={null} onClose={() => setCreating(false)} onSaved={reload} />
    </>
  )
}
