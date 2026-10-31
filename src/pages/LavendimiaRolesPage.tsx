import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/card'
import { useLavendimiaSystem } from '@/features/lavendimia'
import { RolesTab, useRoles } from '@/features/roles'

export function LavendimiaRolesPage() {
  const { system, error: systemError } = useLavendimiaSystem()
  const roles = useRoles(system?.id ?? '')

  return (
    <>
      <PageHeader title="Roles de La Vendimia" description="Los roles los declara el propio sistema. Aquí solo se ven." />
      <Card>
        <RolesTab systemName="La Vendimia" roles={roles.roles} isLoading={roles.isLoading} error={systemError ?? roles.error} />
      </Card>
    </>
  )
}
