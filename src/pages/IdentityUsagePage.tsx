import { Search } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { IdentityUsageCards, LookupDialog, QueriesBySystem, useIdentityClientSystems, useProviderUsage } from '@/features/identity'

export function IdentityUsagePage() {
  const usage = useProviderUsage()
  const systems = useIdentityClientSystems()
  const [looking, setLooking] = useState(false)

  return (
    <>
      <PageHeader
        title="Consumo de identidad"
        description="Consulta de DNI y RUC para los sistemas de Atmosfera. Guarda cada documento para no gastar consultas del proveedor dos veces."
        actions={
          <Button variant="outline" onClick={() => setLooking(true)}>
            <Search className="size-4" />
            Consultar documento
          </Button>
        }
      />
      <IdentityUsageCards usage={usage} />
      <div className="mt-4">
        <QueriesBySystem systems={systems.filter((system) => system.isActive)} monthlyCap={usage.monthlyCap} />
      </div>
      <LookupDialog open={looking} onClose={() => setLooking(false)} />
    </>
  )
}
