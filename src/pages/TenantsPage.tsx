import { Plus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { CreateTenantDialog, TenantsList, useTenants } from '@/features/tenants'

export function TenantsPage() {
  const { tenants, isLoading, error, reload } = useTenants()
  const [creating, setCreating] = useState(false)

  return (
    <>
      <PageHeader
        title="Empresas"
        description="Las empresas cliente y los sistemas que tiene contratados cada una."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nueva empresa
          </Button>
        }
      />
      <TenantsList tenants={tenants} isLoading={isLoading} error={error} onChanged={reload} />
      <CreateTenantDialog open={creating} onClose={() => setCreating(false)} onCreated={reload} />
    </>
  )
}
