import { useNavigate } from 'react-router-dom'
import { BackLink } from '@/components/common/BackLink'
import { PageHeader } from '@/components/common/PageHeader'
import { ROUTES } from '@/config/routes'
import { CompanyForm } from '@/features/companies'

export function CompanyNewPage() {
  const navigate = useNavigate()

  return (
    <>
      <BackLink to={ROUTES.billing.companies} label="Emisores" />
      <PageHeader title="Nueva empresa" description="Registra una empresa emisora y conecta su cuenta de Nubefact." />
      <CompanyForm onSubmit={() => navigate(ROUTES.billing.companies)} />
    </>
  )
}
