import { PageHeader } from '@/components/common/PageHeader'
import { SystemsList, useSystems } from '@/features/systems'

export function SystemsPage() {
  const { systems, isLoading, error } = useSystems()

  return (
    <>
      <PageHeader title="Sistemas" description="Los sistemas de Atmosfera a los que se puede dar acceso." />
      <SystemsList systems={systems} isLoading={isLoading} error={error} />
    </>
  )
}
