import { Plus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AccessTable, AssignAccessDialog, useAccessBySystem } from '@/features/access'
import { useLavendimiaSystem } from '@/features/lavendimia'

export function LavendimiaUsersPage() {
  const { system, error: systemError } = useLavendimiaSystem()
  // With no system yet (loading) the id is empty and nothing is requested.
  const access = useAccessBySystem(system?.id ?? '')
  const [assigning, setAssigning] = useState(false)

  return (
    <>
      <PageHeader
        title="Usuarios de La Vendimia"
        description="Quién puede entrar a La Vendimia, en qué empresa y con qué rol."
        actions={
          <Button onClick={() => setAssigning(true)} disabled={!system}>
            <Plus className="size-4" />
            Agregar usuario
          </Button>
        }
      />
      <Card>
        <AccessTable items={access.items} variant="bySystem" isLoading={access.isLoading} error={systemError ?? access.error} onChanged={access.reload} />
      </Card>
      {system && <AssignAccessDialog open={assigning} onClose={() => setAssigning(false)} onAssigned={access.reload} systemId={system.id} />}
    </>
  )
}
