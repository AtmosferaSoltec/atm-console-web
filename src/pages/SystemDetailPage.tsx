import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackLink } from '@/components/common/BackLink'
import { NotFoundCard } from '@/components/common/NotFoundCard'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/config/routes'
import { AccessTable, AssignAccessDialog, useAccessBySystem } from '@/features/access'
import { RolesTab, useRoles } from '@/features/roles'
import { SystemCredentialsCard, SystemDangerZone, SystemSessionCard, SystemSummary, useSystem } from '@/features/systems'
import type { SystemItem } from '@/features/systems'
import { SystemTenantsTable, useTenants } from '@/features/tenants'

function SystemTabs({ system }: { system: SystemItem }) {
  const tenants = useTenants()
  const access = useAccessBySystem(system.id)
  const roles = useRoles(system.id)
  const [assigning, setAssigning] = useState(false)

  const systemTenants = tenants.tenants.filter((tenant) => tenant.systems.some((item) => item.id === system.id))

  return (
    <Tabs defaultValue="users">
      <Card className="mb-6">
        <TabsList>
          <TabsTrigger value="users">Usuarios ({access.items.length})</TabsTrigger>
          <TabsTrigger value="roles">Roles ({roles.roles.length})</TabsTrigger>
          <TabsTrigger value="tenants">Empresas ({systemTenants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <CardHeader className="items-center pb-3">
            <div>
              <CardTitle>Usuarios con acceso</CardTitle>
              <CardDescription>Quién puede entrar a {system.name}, en qué empresa y con qué rol</CardDescription>
            </div>
            <Button onClick={() => setAssigning(true)}>
              <Plus className="size-4" />
              Agregar usuario
            </Button>
          </CardHeader>
          <div className="border-t border-slate-100">
            <AccessTable items={access.items} variant="bySystem" isLoading={access.isLoading} error={access.error} onChanged={access.reload} />
          </div>
        </TabsContent>

        <TabsContent value="roles">
          <RolesTab
            systemId={system.id}
            systemName={system.name}
            roles={roles.roles}
            isLoading={roles.isLoading}
            error={roles.error}
            onChanged={() => {
              roles.reload()
              access.reload()
            }}
          />
        </TabsContent>

        <TabsContent value="tenants">
          <CardHeader className="items-center pb-3">
            <div>
              <CardTitle>Empresas</CardTitle>
              <CardDescription>Las empresas que tienen contratado {system.name}. Se gestionan desde Empresas.</CardDescription>
            </div>
          </CardHeader>
          <div className="border-t border-slate-100">
            <SystemTenantsTable tenants={systemTenants} isLoading={tenants.isLoading} error={tenants.error} />
          </div>
        </TabsContent>
      </Card>

      <AssignAccessDialog open={assigning} onClose={() => setAssigning(false)} onAssigned={access.reload} systemId={system.id} />
    </Tabs>
  )
}

export function SystemDetailPage() {
  const { systemId } = useParams()
  const navigate = useNavigate()
  const { system, isLoading, error, reload } = useSystem(systemId)

  return (
    <>
      <BackLink to={ROUTES.auth.systems} label="Sistemas" />
      {isLoading ? (
        <p className="py-10 text-center text-sm text-slate-500">Cargando sistema...</p>
      ) : !system ? (
        <NotFoundCard message={error ?? 'No encontramos este sistema.'} />
      ) : (
        <>
          <SystemSummary system={system} />
          <SystemTabs system={system} />
          <SystemSessionCard system={system} onChanged={reload} />
          <SystemCredentialsCard system={system} onChanged={reload} />
          <SystemDangerZone system={system} onDeleted={() => navigate(ROUTES.auth.systems, { replace: true })} />
        </>
      )}
    </>
  )
}
