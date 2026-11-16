import { useNavigate } from 'react-router-dom'
import { BackLink } from '@/components/common/BackLink'
import { PageHeader } from '@/components/common/PageHeader'
import { ROUTES, pulsoCompanyPath } from '@/config/routes'
import { LoadState, NewClientWizard, usePulsoAdmin } from '@/features/pulso-setup'

export function PulsoClientNewPage() {
  const navigate = useNavigate()
  const { data, error, reload } = usePulsoAdmin()

  return (
    <>
      <BackLink to={ROUTES.pulso.clients} label="Clientes y empresas" />
      <PageHeader title="Nuevo cliente" description="Cliente, empresas, sedes, módulos y su primer administrador, en un solo paso." />
      {data ? (
        <NewClientWizard data={data} onCancel={() => navigate(ROUTES.pulso.clients)} onCreated={(companyId) => navigate(pulsoCompanyPath(companyId))} />
      ) : (
        <LoadState error={error} onRetry={reload} />
      )}
    </>
  )
}
