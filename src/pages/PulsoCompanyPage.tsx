import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BackLink } from '@/components/common/BackLink'
import { NotFoundCard } from '@/components/common/NotFoundCard'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES, pulsoCompanyPath } from '@/config/routes'
import {
  BranchesTab,
  CompanyAvatar,
  GeneralTab,
  GymPreview,
  LoadState,
  ModulesTab,
  ProductCategoriesTab,
  TeamTab,
  companyHasModule,
  useCompanyDetail,
  usePulsoAdmin,
} from '@/features/pulso-setup'

const TABS = [
  { value: 'modules', label: 'Módulos' },
  { value: 'branches', label: 'Sedes' },
  { value: 'team', label: 'Equipo' },
  { value: 'categories', label: 'Categorías', module: 'sales' },
  { value: 'general', label: 'General' },
  { value: 'preview', label: 'Vista previa' },
] as const

export function PulsoCompanyPage() {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { data, error, reload } = usePulsoAdmin()
  const detail = useCompanyDetail(data, companyId)
  // A tab of a module (product categories: sales) only exists while the company has that module.
  const tabs = TABS.filter((item) => !('module' in item) || (data && detail && companyHasModule(data.modules, detail.company, item.module)))
  const tab = tabs.some((item) => item.value === params.get('tab')) ? (params.get('tab') as string) : 'modules'

  if (!data || !detail) {
    return (
      <>
        <BackLink to={ROUTES.pulso.clients} label="Clientes y empresas" />
        {data ? <NotFoundCard message="Esta empresa no tiene Pulso o ya no existe." /> : <LoadState error={error} onRetry={reload} />}
      </>
    )
  }

  const { company, client, siblings } = detail
  const branchCount = company.branches.length

  return (
    <>
      <BackLink to={ROUTES.pulso.clients} label="Clientes y empresas" />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <CompanyAvatar logoFileId={company.tenant?.logoFileId ?? ''} name={company.tradeName} color={company.brandColor} className="size-12 rounded-xl text-lg" />
          <div className="min-w-0">
            <p className="text-sm text-slate-500">{client.name}</p>
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-semibold tracking-tight text-slate-900">
              {company.tradeName}
              {company.status === 'suspended' ? <Badge tone="warning">Suspendida</Badge> : <Badge tone="success">Activa</Badge>}
            </h1>
            <p className="text-sm text-slate-500">
              {company.ruc ? `RUC ${company.ruc}` : 'Sin RUC'} · {branchCount} {branchCount === 1 ? 'sede' : 'sedes'} · {company.team.length}{' '}
              {company.team.length === 1 ? 'persona' : 'personas'}
            </p>
          </div>
        </div>
        {siblings.length > 1 && (
          <div className="w-full sm:w-64">
            <Select
              aria-label="Otra empresa del cliente"
              value={company.id}
              onValueChange={(id) => navigate(`${pulsoCompanyPath(id)}?tab=${tab}`)}
              options={siblings.map((sibling) => ({ value: sibling.id, label: sibling.tradeName }))}
            />
          </div>
        )}
      </div>

      <Card>
        <Tabs value={tab} onValueChange={(value) => setParams({ tab: value }, { replace: true })}>
          <TabsList className="overflow-x-auto">
            {tabs.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="p-5">
            <TabsContent value="modules">
              <ModulesTab key={company.id} company={company} data={data} onChanged={reload} />
            </TabsContent>
            <TabsContent value="branches">
              <BranchesTab key={company.id} company={company} data={data} onChanged={reload} />
            </TabsContent>
            <TabsContent value="team">
              <TeamTab key={company.id} company={company} data={data} onChanged={reload} />
            </TabsContent>
            {tab === 'categories' && (
              <TabsContent value="categories">
                <ProductCategoriesTab key={company.id} company={company} data={data} onChanged={reload} />
              </TabsContent>
            )}
            <TabsContent value="general">
              <GeneralTab key={company.id} company={company} data={data} onChanged={reload} />
            </TabsContent>
            <TabsContent value="preview">
              <GymPreview company={company} modules={data.modules} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </>
  )
}
