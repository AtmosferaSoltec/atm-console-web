import { Plus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { CreateUserDialog, UsersList, useUsers } from '@/features/users'

export function UsersPage() {
  const { users, isLoading, error, reload } = useUsers()
  const [creating, setCreating] = useState(false)

  return (
    <>
      <PageHeader
        title="Usuarios"
        description="Cuentas globales de Atmosfera. Una por persona, identificada por su DNI."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nuevo usuario
          </Button>
        }
      />
      <UsersList users={users} isLoading={isLoading} error={error} />
      <CreateUserDialog open={creating} onClose={() => setCreating(false)} onCreated={reload} />
    </>
  )
}
