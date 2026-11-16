import { Briefcase, Building2, MapPin, Plus, Puzzle, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROUTES, pulsoCompanyPath } from '@/config/routes'
import { AddCompanyDialog, ClientCard, LoadState, usePulsoAdmin } from '@/features/pulso-setup'

export function PulsoClientsPage() {
  const navigate = useNavigate()
  const { data, error, reload } = usePulsoAdmin()
  const summaries = useMemo(() => data?.clients ?? [], [data])
  const [search, setSearch] = useState('')
  const [addingTo, setAddingTo] = useState<string | null>(null)
  const addingClient = summaries.find((summary) => summary.id === addingTo) ?? null

  const companies = summaries.flatMap((summary) => summary.companies)
  const term = search.trim().toLowerCase()
  const filtered = useMemo(
    () =>
      term
        ? summaries.filter(
            ({ name, companies: own }) =>
              name.toLowerCase().includes(term) || own.some((company) => company.tradeName.toLowerCase().includes(term) || company.ruc.includes(term)),
          )
        : summaries,
    [summaries, term],
  )

  return (
    <>
      <PageHeader
        title="Clientes y empresas"
        description="Quién usa Pulso: cada cliente con sus empresas, sus sedes y los módulos que le diste."
        actions={
          <Button onClick={() => navigate(ROUTES.pulso.clientNew)}>
            <Plus className="size-4" />
            Agregar cliente
          </Button>
        }
      />
      {!data && <LoadState error={error} onRetry={reload} />}
      {data && (
        <>

      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Clientes" value={String(summaries.length)} hint="Con Pulso" icon={Briefcase} />
        <StatCard
          label="Empresas"
          value={String(companies.length)}
          hint={`${companies.filter((company) => company.status === 'suspended').length} suspendidas`}
          icon={Building2}
          tone="sky"
        />
        <StatCard label="Sedes" value={String(companies.reduce((total, company) => total + company.branches.length, 0))} hint="Se cobran por sede" icon={MapPin} tone="amber" />
        <StatCard
          label="Módulos opcionales"
          value={String(companies.reduce((total, company) => total + company.modules.length, 0))}
          hint="Encendidos en todas las empresas"
          icon={Puzzle}
          tone="violet"
        />
      </div>

      <div className="mb-4 max-w-sm">
        <Input leadingIcon={Search} aria-label="Buscar" placeholder="Buscar cliente, empresa o RUC" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <div className="space-y-4">
        {filtered.map((summary) => (
          <ClientCard key={summary.id} summary={summary} modules={data.modules} onAddCompany={setAddingTo} />
        ))}
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
            {term ? `Ningún cliente coincide con “${search.trim()}”.` : 'Ningún cliente usa Pulso todavía. Dale Pulso al primero con “Agregar cliente”.'}
          </p>
        )}
      </div>

      <AddCompanyDialog client={addingClient} data={data} onClose={() => setAddingTo(null)} onCreated={(companyId) => navigate(pulsoCompanyPath(companyId))} />
        </>
      )}
    </>
  )
}
