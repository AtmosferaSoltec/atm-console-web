import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ClientSystemsTable, CreateClientSystemDialog, useIdentityClientSystems } from '@/features/identity'
import type { IdentityClientSystem } from '@/features/identity'

export function IdentitySystemsPage() {
  const systems = useIdentityClientSystems()
  const [creating, setCreating] = useState(false)
  const [revoking, setRevoking] = useState<IdentityClientSystem | null>(null)

  return (
    <>
      <PageHeader
        title="Sistemas con acceso"
        description="Cada sistema que consulta identidades tiene su propia clave. Puedes revocar una sin afectar a las demás."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nuevo sistema
          </Button>
        }
      />
      <Card>
        <ClientSystemsTable systems={systems} onRevoke={setRevoking} />
      </Card>
      <CreateClientSystemDialog open={creating} onClose={() => setCreating(false)} />
      <ConfirmDialog
        open={revoking !== null}
        onClose={() => setRevoking(null)}
        onConfirm={() => setRevoking(null)}
        title="¿Desactivar esta clave?"
        description={`${revoking?.name ?? ''} recibirá un error 403 en cada consulta hasta que le crees una clave nueva.`}
        confirmLabel="Desactivar"
        destructive
      />
    </>
  )
}
