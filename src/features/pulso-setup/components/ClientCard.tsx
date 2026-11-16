import { ChevronRight, MapPin, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { pulsoCompanyPath } from '@/config/routes'
import { moduleName } from '../services/moduleCatalog'
import type { ClientCardProps } from '../types/pulsoSetup.types'

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

/** A client with each of its companies as a row that opens the company. */
export function ClientCard({ summary, modules, onAddCompany }: ClientCardProps) {
  const { companies, branchCount } = summary

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-900">{summary.name}</h2>
          <p className="text-xs text-slate-500">
            {plural(companies.length, 'empresa', 'empresas')} · {plural(branchCount, 'sede', 'sedes')}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => onAddCompany(summary.id)}>
          <Plus className="size-4" />
          Empresa
        </Button>
      </div>

      <ul className="divide-y divide-slate-100">
        {companies.map((company) => (
          <li key={company.id}>
            <Link
              to={pulsoCompanyPath(company.id)}
              className="group grid items-center gap-3 px-5 py-4 transition hover:bg-slate-50/80 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.6fr)_auto]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: company.brandColor }}>
                  {company.tradeName.slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-medium text-slate-900">
                    <span className="truncate">{company.tradeName}</span>
                    {company.status === 'suspended' && <Badge tone="warning">Suspendida</Badge>}
                  </span>
                  <span className="block text-xs text-slate-500">{company.ruc ? `RUC ${company.ruc}` : 'Sin RUC'}</span>
                </span>
              </div>
              <div className="flex min-w-0 items-start gap-1.5 text-sm text-slate-600">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
                <span className="min-w-0">
                  {plural(company.branches.length, 'sede', 'sedes')}
                  <span className="block truncate text-xs text-slate-500">{company.branches.map((branch) => branch.name).join(', ')}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {company.modules.length === 0 && <span className="text-xs text-slate-500">Solo módulos base</span>}
                {company.modules.map((code) => (
                  <Badge key={code} tone="info" dot={false}>
                    {moduleName(modules, code)}
                  </Badge>
                ))}
              </div>
              <ChevronRight className="hidden size-4 text-slate-300 transition group-hover:text-slate-500 md:block" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
