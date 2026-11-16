import { PageHeader } from '@/components/common/PageHeader'
import { LoadState, ModuleCatalog, usePulsoAdmin } from '@/features/pulso-setup'

export function PulsoModulesPage() {
  const { data, error, reload } = usePulsoAdmin()

  return (
    <>
      <PageHeader
        title="Catálogo de módulos"
        description="Lo que Pulso sabe hacer. Los módulos base los tiene toda empresa; los opcionales los enciendes por empresa."
      />
      {data ? <ModuleCatalog data={data} /> : <LoadState error={error} onRetry={reload} />}
    </>
  )
}
