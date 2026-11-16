import { Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import { KIND_DESCRIPTIONS, KIND_LABELS, companyHasModule, moduleName, switchableRequirements } from '../services/moduleCatalog'
import type { ModuleCatalogProps, ModuleKind } from '../types/pulsoSetup.types'

const KIND_ORDER: ModuleKind[] = ['base', 'optional']

/** The modules pulso-api offers, grouped by kind, with how many active companies use each one. */
export function ModuleCatalog({ data }: ModuleCatalogProps) {
  const { modules, companies } = data
  const activeCompanies = companies.filter((company) => company.status === 'active')

  return (
    <div className="space-y-8">
      {KIND_ORDER.map((kind) => (
        <section key={kind}>
          <div className="mb-3">
            <h2 className="text-base font-semibold text-slate-900">{KIND_LABELS[kind]}</h2>
            <p className="text-sm text-slate-500">{KIND_DESCRIPTIONS[kind]}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {modules
              .filter((module) => module.kind === kind)
              .map((module) => {
                const Icon = module.icon
                const users = activeCompanies.filter((company) => companyHasModule(modules, company, module.code))
                const needs = switchableRequirements(modules, module)
                return (
                  <Card key={module.code} className="flex flex-col p-5">
                    <span className={cn('flex size-10 items-center justify-center rounded-lg', kind === 'base' ? 'bg-slate-100 text-slate-600' : 'bg-sky-50 text-sky-700')}>
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-3 font-semibold text-slate-900">{module.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{module.description}</p>
                    <ul className="mt-3 space-y-1 text-sm text-slate-600">
                      {module.includes.map((item) => (
                        <li key={item} className="flex gap-2">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-brand-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    {needs.length > 0 && <p className="mt-3 text-xs text-amber-700">Necesita {needs.map((code) => moduleName(modules, code)).join(' y ')}</p>}
                    <div className="mt-auto pt-4">
                      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                        <span className="min-w-0 truncate" title={users.map((company) => company.tradeName).join(', ')}>
                          {kind === 'base' ? `Todas (${activeCompanies.length})` : `${users.length} de ${activeCompanies.length} empresas activas`}
                        </span>
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">{module.code}</code>
                      </div>
                    </div>
                  </Card>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )
}
