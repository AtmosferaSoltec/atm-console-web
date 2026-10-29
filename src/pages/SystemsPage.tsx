import { Plus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { CreateSystemDialog, SystemsList, useSystems } from '@/features/systems'

export function SystemsPage() {
  const { systems, isLoading, error, reload } = useSystems()
  const [creating, setCreating] = useState(false)

  return (
    <>
      <PageHeader
        title="Sistemas"
        description="Los sistemas de Atmosfera a los que se puede dar acceso."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nuevo sistema
          </Button>
        }
      />
      <SystemsList systems={systems} isLoading={isLoading} error={error} />
      <CreateSystemDialog open={creating} onClose={() => setCreating(false)} onCreated={reload} />
    </>
  )
}
