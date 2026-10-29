import { useParams } from 'react-router-dom'
import { BackLink } from '@/components/common/BackLink'
import { NotFoundCard } from '@/components/common/NotFoundCard'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/config/routes'
import { ApiKeysTab, CompanySummary, GeneralTab, NubefactTab, SeriesTab, useCompany, useCompanyApiKeys, useCompanySeries } from '@/features/companies'
import { EMPTY_DOCUMENT_FILTERS, InvoicesTable, useInvoices } from '@/features/documents'

export function CompanyDetailPage() {
  const { companyId } = useParams()
  const company = useCompany(companyId)
  const series = useCompanySeries(companyId)
  const keys = useCompanyApiKeys(companyId)
  const invoices = useInvoices({ ...EMPTY_DOCUMENT_FILTERS, companyId: companyId ?? 'none' })

  return (
    <>
      <BackLink to={ROUTES.billing.companies} label="Emisores" />
      {!company ? (
        <NotFoundCard message="No encontramos esta empresa." />
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
                <GeneralTab company={company} />
              </TabsContent>
              <TabsContent value="nubefact">
                <NubefactTab company={company} />
              </TabsContent>
              <TabsContent value="api-keys">
                <ApiKeysTab keys={keys} />
              </TabsContent>
              <TabsContent value="series">
                <SeriesTab series={series} />
              </TabsContent>
              <TabsContent value="documents">
                <InvoicesTable invoices={invoices} hideCompany />
              </TabsContent>
            </Card>
          </Tabs>
        </>
      )}
    </>
  )
}
