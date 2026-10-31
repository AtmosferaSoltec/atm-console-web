import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BackLink } from '@/components/common/BackLink'
import { NotFoundCard } from '@/components/common/NotFoundCard'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/config/routes'
import { ApiKeysTab, CompanySummary, GeneralTab, NubefactTab, SeriesTab, useCompany, useCompanyApiKeys, useCompanySeries } from '@/features/companies'
import { EMPTY_DOCUMENT_FILTERS, InvoicesTable, useInvoices } from '@/features/documents'

export function CompanyDetailPage() {
  const { companyId } = useParams()
  const { company, isLoading, error, reload } = useCompany(companyId)
  const series = useCompanySeries(companyId)
  const keys = useCompanyApiKeys(companyId)
  const filters = useMemo(() => ({ ...EMPTY_DOCUMENT_FILTERS, companyId: companyId ?? 'all' }), [companyId])
  const invoices = useInvoices(filters)

  // Changing a series or a key moves the counts of the summary too.
  const reloadAll = () => {
    reload()
    series.reload()
    keys.reload()
  }

  return (
    <>
      <BackLink to={ROUTES.billing.companies} label="Emisores" />
      {isLoading ? (
        <p className="py-10 text-center text-sm text-slate-500">Cargando empresa...</p>
      ) : !company ? (
        <NotFoundCard message={error ?? 'No encontramos esta empresa.'} />
      ) : (
        <>
          <CompanySummary company={company} />
          <Tabs defaultValue="general">
            <Card>
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="nubefact">Nubefact</TabsTrigger>
                <TabsTrigger value="api-keys">API keys</TabsTrigger>
                <TabsTrigger value="series">Series</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <GeneralTab company={company} onChanged={reload} />
              </TabsContent>
              <TabsContent value="nubefact">
                <NubefactTab company={company} onChanged={reload} />
              </TabsContent>
              <TabsContent value="api-keys">
                <ApiKeysTab companyId={company.id} keys={keys.items} isLoading={keys.isLoading} error={keys.error} onChanged={reloadAll} />
              </TabsContent>
              <TabsContent value="series">
                <SeriesTab companyId={company.id} series={series.items} isLoading={series.isLoading} error={series.error} onChanged={reloadAll} />
              </TabsContent>
              <TabsContent value="documents">
                <InvoicesTable invoices={invoices.page.items} hideCompany emptyMessage={invoices.isLoading ? 'Cargando comprobantes...' : (invoices.error ?? undefined)} />
                <p className="border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
                  Se muestran los últimos {invoices.page.items.length} de {invoices.page.total}.{' '}
                  <Link to={ROUTES.billing.invoices} className="font-medium text-brand-700 hover:text-brand-800">
                    Ver todos los comprobantes
                  </Link>
                </p>
              </TabsContent>
            </Card>
          </Tabs>
        </>
      )}
    </>
  )
}
