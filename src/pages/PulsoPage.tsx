import { Plus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { GroupDialog, PulsoGroupsList, usePulsoGroups, usePulsoTeam } from '@/features/pulso'

export function PulsoPage() {
  const { groups, isLoading, error, reload } = usePulsoGroups()
  const { team, isLoading: teamLoading, reload: reloadTeam } = usePulsoTeam()
  const [creating, setCreating] = useState(false)

  return (
    <>
      <PageHeader
        title="Pulso"
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nuevo grupo
          </Button>
        }
      />
      <PulsoGroupsList groups={groups} team={team} isLoading={isLoading || teamLoading} error={error} onChanged={reload} onTeamChanged={reloadTeam} />
      <GroupDialog open={creating} group={null} onClose={() => setCreating(false)} onSaved={reload} />
    </>
  )
}
