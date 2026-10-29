import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CompaniesTable, PersonsTable, useCachedCompanies, useCachedPersons } from '@/features/identity'

export function IdentityRecordsPage() {
  const persons = useCachedPersons()
  const companies = useCachedCompanies()

  return (
    <>
      <PageHeader title="Datos guardados" description="Lo que ya se consultó al proveedor. Solo se guardan nombres (personas) y razón social, nombre comercial y dirección (empresas)." />
      <Tabs defaultValue="persons">
        <Card>
          <TabsList>
            <TabsTrigger value="persons">Personas ({persons.length})</TabsTrigger>
            <TabsTrigger value="companies">Empresas ({companies.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="persons">
            <PersonsTable persons={persons} />
          </TabsContent>
          <TabsContent value="companies">
            <CompaniesTable companies={companies} />
          </TabsContent>
        </Card>
      </Tabs>
    </>
  )
}
