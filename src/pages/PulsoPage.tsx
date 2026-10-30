import { PageHeader } from '@/components/common/PageHeader'
import { PulsoClientsList, usePulsoClients } from '@/features/pulso'

export function PulsoPage() {
  const { clients, isLoading, error, reload } = usePulsoClients()

  return (
    <>
      <PageHeader title="Sedes de Pulso" description="Los gimnasios de cada cliente y sus sedes. Las sedes solo se crean aquí." />
      <PulsoClientsList clients={clients} isLoading={isLoading} error={error} onChanged={reload} />
    </>
  )
}
