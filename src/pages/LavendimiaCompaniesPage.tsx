import { Plus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LavendimiaCompaniesTable, NewLavendimiaCompanyDialog, useLavendimiaSystem } from '@/features/lavendimia'
import { useTenants } from '@/features/tenants'

export function LavendimiaCompaniesPage() {
  const { system, isLoading: systemLoading, error: systemError } = useLavendimiaSystem()
  const { tenants, isLoading: tenantsLoading, error: tenantsError, reload } = useTenants()
  const [creating, setCreating] = useState(false)

  const companies = tenants.filter((tenant) => system !== undefined && tenant.systems.some((item) => item.id === system.id))
  const isLoading = systemLoading || tenantsLoading
  const error = systemError ?? tenantsError
  const emptyMessage = isLoading ? 'Cargando empresas...' : (error ?? (system ? 'Todavía no hay empresas con La Vendimia.' : 'La Vendimia no está registrada en el catálogo de sistemas.'))

  return (
    <>
      <PageHeader
        title="Empresas de La Vendimia"
        description="Las empresas que usan La Vendimia. Cada una entra con sus propios usuarios y su propio catálogo."
        actions={
          <Button onClick={() => setCreating(true)} disabled={!system}>
            <Plus className="size-4" />
            Nueva empresa
          </Button>
        }
      />
      <Card>
        <LavendimiaCompaniesTable companies={companies} emptyMessage={emptyMessage} />
      </Card>
      <NewLavendimiaCompanyDialog open={creating} systemId={system?.id ?? null} onClose={() => setCreating(false)} onCreated={reload} />
    </>
  )
}
