import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { ROUTES } from '@/config/routes'
import { CompaniesList, useCompanies } from '@/features/companies'

export function CompaniesPage() {
  const { items, isLoading, error } = useCompanies()

  return (
    <>
      <PageHeader
        title="Emisores"
        description="Empresas que emiten comprobantes y guías a través de Nubefact."
        actions={
          <Link to={ROUTES.billing.companyNew} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700">
            <Plus className="size-4" />
            Nueva empresa
          </Link>
        }
      />
      <CompaniesList companies={items} isLoading={isLoading} error={error} />
    </>
  )
}
