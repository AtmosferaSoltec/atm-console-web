import { ArrowLeft, ArrowRight, Building2, Check, MapPin, Plus, Puzzle, UserRound, UserCog } from 'lucide-react'
import { useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { pulsoErrorMessage } from '@/features/pulso'
import { cn } from '@/utils/cn'
import { companyProblems, emptyClient, emptyCompany } from '../services/drafts'
import { moduleName } from '../services/moduleCatalog'
import { createClientWithCompanies } from '../services/pulsoAdminService'
import type { ClientDraft, DraftCompany, NewClientWizardProps } from '../types/pulsoSetup.types'
import { CompanyDraftFields } from './CompanyDraftFields'
import { ModulePicker } from './ModulePicker'

const STEPS = [
  { title: 'Cliente', hint: 'El dueño del negocio', icon: UserRound },
  { title: 'Empresas y sedes', hint: 'Qué marcas y dónde', icon: Building2 },
  { title: 'Módulos', hint: 'Qué puede usar cada empresa', icon: Puzzle },
  { title: 'Administrador', hint: 'Quién entra primero', icon: UserCog },
  { title: 'Revisar', hint: 'Confirmar y crear', icon: Check },
] as const

const NEW_CLIENT = 'new'

function stepProblems(step: number, draft: ClientDraft): string[] {
  if (step === 0) return draft.existingClientId || draft.name.trim() ? [] : ['Escribe el nombre del cliente.']
  if (step === 1) return draft.companies.flatMap((company, index) => companyProblems({ ...company, adminDocument: '', adminName: '' }).map((problem) => `Empresa ${index + 1}: ${problem}`))
  if (step === 3) return draft.companies.flatMap((company) => companyProblems(company).map((problem) => `${company.tradeName}: ${problem}`))
  return []
}

/** Creates a client with its companies, branches, modules and first admins in one flow. */
export function NewClientWizard({ data, onCancel, onCreated }: NewClientWizardProps) {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<ClientDraft>(emptyClient)
  const [showProblems, setShowProblems] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [failure, setFailure] = useState<string | null>(null)
  const problems = stepProblems(step, draft)
  const { modules, systemId } = data
  const existing = data.authClients.find((client) => client.id === draft.existingClientId)
  const clientName = existing?.name ?? draft.name.trim()
  const creating = progress !== null

  const create = async () => {
    if (!systemId) {
      setFailure('Pulso no está registrado como sistema en Atmósfera.')
      return
    }
    setFailure(null)
    setProgress('Empezando…')
    try {
      onCreated(await createClientWithCompanies(draft, systemId, setProgress))
    } catch (caught) {
      setFailure(
        `${pulsoErrorMessage(caught, 'No se pudo terminar.')} Lo que se alcanzó a crear quedó guardado: revísalo en la lista de clientes antes de intentar de nuevo.`,
      )
      setProgress(null)
    }
  }

  const setCompany = (company: DraftCompany) => setDraft({ ...draft, companies: draft.companies.map((item) => (item.key === company.key ? company : item)) })

  const next = () => {
    if (problems.length) {
      setShowProblems(true)
      return
    }
    setShowProblems(false)
    if (step < STEPS.length - 1) setStep(step + 1)
    else void create()
  }

  const back = () => {
    setShowProblems(false)
    setStep(step - 1)
  }

  const branchTotal = draft.companies.reduce((total, company) => total + company.branches.filter((branch) => branch.name.trim()).length, 0)

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <ol className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
        {STEPS.map((item, index) => {
          const Icon = item.icon
          const done = index < step
          const current = index === step
          return (
            <li key={item.title} className="shrink-0">
              <button
                type="button"
                disabled={index > step || creating}
                onClick={() => setStep(index)}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition disabled:cursor-default',
                  current ? 'bg-white shadow-card ring-1 ring-slate-200' : 'hover:bg-white/60',
                )}
              >
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full text-sm',
                    current && 'bg-brand-600 text-white',
                    done && 'bg-brand-100 text-brand-700',
                    !current && !done && 'bg-slate-100 text-slate-400',
                  )}
                >
                  {done ? <Check className="size-4" /> : <Icon className="size-4" />}
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className={cn('block text-sm font-medium', current ? 'text-slate-900' : 'text-slate-600')}>{item.title}</span>
                  <span className="block text-xs text-slate-500">{item.hint}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <Card>
        <div className="border-b border-slate-100 px-6 py-5">
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Paso {step + 1} de {STEPS.length}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{STEPS[step].title}</h2>
        </div>

        <div className="space-y-5 px-6 py-5">
          {step === 0 && (
            <>
              <p className="text-sm text-slate-500">
                El cliente es quien te paga. Puede tener una o varias empresas (cada una con su RUC y su marca). Si ya usa otro sistema de Atmósfera, elígelo.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Cliente" htmlFor="client-pick">
                  <Select
                    id="client-pick"
                    value={draft.existingClientId ?? NEW_CLIENT}
                    onValueChange={(value) => setDraft({ ...draft, existingClientId: value === NEW_CLIENT ? null : value })}
                    options={[{ value: NEW_CLIENT, label: 'Cliente nuevo' }, ...data.authClients.map((client) => ({ value: client.id, label: client.name }))]}
                  />
                </FormField>
                {!draft.existingClientId && (
                  <FormField label="Nombre del cliente" htmlFor="client-name" hint="Para ti. El gimnasio no lo ve.">
                    <Input id="client-name" value={draft.name} placeholder="Ej. Iron Gym" maxLength={120} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
                  </FormField>
                )}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              {draft.companies.length === 1 && !draft.companies[0].tradeName && clientName && (
                <Button variant="outline" size="sm" onClick={() => setCompany({ ...draft.companies[0], tradeName: clientName })}>
                  Usar “{clientName}” como la empresa
                </Button>
              )}
              {draft.companies.map((company, index) => (
                <CompanyDraftFields
                  key={company.key}
                  draft={company}
                  index={index}
                  onChange={setCompany}
                  onRemove={draft.companies.length > 1 ? () => setDraft({ ...draft, companies: draft.companies.filter((item) => item.key !== company.key) }) : undefined}
                />
              ))}
              <Button variant="outline" onClick={() => setDraft({ ...draft, companies: [...draft.companies, emptyCompany()] })}>
                <Plus className="size-4" />
                Otra empresa
              </Button>
            </>
          )}

          {step === 2 &&
            draft.companies.map((company) => (
              <section key={company.key} className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">{company.tradeName}</h3>
                <ModulePicker modules={modules} selected={company.modules} onChange={(codes) => setCompany({ ...company, modules: codes })} />
              </section>
            ))}
          {step === 2 && <p className="text-xs text-slate-500">Puedes cambiarlos cuando quieras desde la empresa.</p>}

          {step === 3 && (
            <>
              <p className="text-sm text-slate-500">
                La primera persona que entra a Pulso en cada empresa. Si no tiene cuenta en Atmósfera, se crea con su DNI como contraseña inicial. Puedes dejarlo para después.
              </p>
              {draft.companies.map((company) => (
                <div key={company.key} className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                  <p className="text-sm font-semibold text-slate-900 sm:col-span-2">{company.tradeName}</p>
                  <FormField label="DNI" htmlFor={`admin-dni-${company.key}`}>
                    <Input
                      id={`admin-dni-${company.key}`}
                      value={company.adminDocument}
                      inputMode="numeric"
                      maxLength={8}
                      onChange={(event) => setCompany({ ...company, adminDocument: event.target.value.replace(/\D/g, '') })}
                    />
                  </FormField>
                  <FormField label="Nombre completo" htmlFor={`admin-name-${company.key}`}>
                    <Input id={`admin-name-${company.key}`} value={company.adminName} onChange={(event) => setCompany({ ...company, adminName: event.target.value })} />
                  </FormField>
                </div>
              ))}
            </>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  ['Empresas', draft.companies.length],
                  ['Sedes', branchTotal],
                  ['Administradores', draft.companies.filter((company) => company.adminDocument).length],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 py-3">
                    <p className="text-2xl font-semibold text-slate-900 tabular-nums">{value}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-slate-200">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">{clientName}</p>
                  <p className="text-xs text-slate-500">{existing ? 'Cliente que ya existe en Atmósfera' : 'Cliente nuevo'}</p>
                </div>
                <ul className="divide-y divide-slate-100">
                  {draft.companies.map((company) => (
                    <li key={company.key} className="space-y-1.5 px-4 py-3 text-sm">
                      <p className="font-medium text-slate-900">
                        {company.tradeName} <span className="font-normal text-slate-500">{company.ruc ? `· RUC ${company.ruc}` : '· sin RUC'}</span>
                      </p>
                      <p className="flex flex-wrap items-center gap-1.5 text-slate-600">
                        <MapPin className="size-3.5 text-slate-400" />
                        {company.branches.filter((branch) => branch.name.trim()).map((branch) => branch.name).join(', ')}
                      </p>
                      <p className="text-slate-600">
                        Módulos: {modules.filter((module) => module.kind === 'base').length} base
                        {company.modules.length ? ` + ${company.modules.map((code) => moduleName(modules, code)).join(', ')}` : ''}
                      </p>
                      <p className="text-slate-600">Administrador: {company.adminName ? `${company.adminName} (DNI ${company.adminDocument})` : 'pendiente'}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-slate-500">Se crea el cliente y sus empresas en Atmósfera, se habilita Pulso en cada una y se preparan sus sedes, módulos y administradores.</p>
              {progress && (
                <p role="status" className="rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-900">
                  {progress}
                </p>
              )}
              {failure && (
                <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {failure}
                </p>
              )}
            </div>
          )}

          {showProblems && problems.length > 0 && (
            <ul role="alert" className="space-y-1 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={onCancel} disabled={creating}>
            Cancelar
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            {step > 0 && (
              <Button variant="outline" onClick={back} disabled={creating}>
                <ArrowLeft className="size-4" />
                Atrás
              </Button>
            )}
            <Button onClick={next} disabled={creating}>
              {step === STEPS.length - 1 ? (creating ? 'Creando…' : 'Crear') : 'Siguiente'}
              {step < STEPS.length - 1 && <ArrowRight className="size-4" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
