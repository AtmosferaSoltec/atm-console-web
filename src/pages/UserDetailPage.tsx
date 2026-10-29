import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { BackLink } from '@/components/common/BackLink'
import { NotFoundCard } from '@/components/common/NotFoundCard'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/config/routes'
import { AccessTable, AssignAccessDialog, useAccessByUser } from '@/features/access'
import { UserActions, UserSummary, useUser } from '@/features/users'
import type { UserItem } from '@/features/users'

function UserAccessCard({ user }: { user: UserItem }) {
  const access = useAccessByUser(user.id)
  const [assigning, setAssigning] = useState(false)

  return (
    <Card className="mb-6">
      <CardHeader className="items-center pb-3">
        <div>
          <CardTitle>Accesos</CardTitle>
          <CardDescription>A qué sistemas entra {user.fullName.split(' ')[0]}, en qué empresa y con qué rol</CardDescription>
        </div>
        <Button onClick={() => setAssigning(true)}>
          <Plus className="size-4" />
          Asignar acceso
        </Button>
      </CardHeader>
      <div className="border-t border-slate-100">
        <AccessTable items={access.items} variant="byUser" isLoading={access.isLoading} error={access.error} onChanged={access.reload} />
      </div>
      <AssignAccessDialog open={assigning} onClose={() => setAssigning(false)} onAssigned={access.reload} userId={user.id} />
    </Card>
  )
}

export function UserDetailPage() {
  const { userId } = useParams()
  const { user, isLoading, error, reload } = useUser(userId)

  return (
    <>
      <BackLink to={ROUTES.auth.users} label="Usuarios" />
      {isLoading ? (
        <p className="py-10 text-center text-sm text-slate-500">Cargando usuario...</p>
      ) : !user ? (
        <NotFoundCard message={error ?? 'No encontramos este usuario.'} />
      ) : (
        <>
          <UserSummary user={user} />
          <UserAccessCard user={user} />
          <UserActions user={user} onChanged={reload} />
        </>
      )}
    </>
  )
}
