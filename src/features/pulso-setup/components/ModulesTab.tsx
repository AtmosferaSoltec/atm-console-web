import { Lock } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { usePulsoActions } from '@/features/pulso'
import { cn } from '@/utils/cn'
import { KIND_DESCRIPTIONS, KIND_LABELS, dependentModules, missingRequirements, moduleName, switchableRequirements } from '../services/moduleCatalog'
import type { CompanyTabProps, ModuleToggleRowProps, PulsoModule } from '../types/pulsoSetup.types'

function ModuleToggleRow({ module, enabled, busy, missing, needs, onToggle }: ModuleToggleRowProps) {
  const Icon = module.icon
  const blocked = !enabled && missing.length > 0

  return (
    <li className={cn('flex items-start gap-4 px-5 py-4', !enabled && 'bg-slate-50/60')}>
      <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', enabled ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-400')}>
        <Icon className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900">{module.name}</p>
        <p className="mt-0.5 text-sm text-slate-500">{module.description}</p>
        {blocked && <p className="mt-1 text-xs font-medium text-amber-700">Primero enciende {missing.join(' y ')}.</p>}
        {!blocked && needs.length > 0 && <p className="mt-1 text-xs text-slate-400">Necesita {needs.join(' y ')}.</p>}
      </div>
      <label className="relative inline-flex shrink-0 cursor-pointer items-center pt-1">
        <input
          type="checkbox"
          role="switch"
          aria-label={`${module.name}: ${enabled ? 'encendido' : 'apagado'}`}
          checked={enabled}
          disabled={blocked || busy}
          onChange={(event) => onToggle(module, event.target.checked)}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-brand-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" />
        <span className="absolute top-1 left-0.5 size-5 translate-y-0 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </label>
    </li>
  )
}

/** Every module of Pulso: the base ones as included, and a switch for each optional one. Changes save at once. */
export function ModulesTab({ company, data, onChanged }: CompanyTabProps) {
  const { modules } = data
  const [enabled, setEnabled] = useState<string[]>(company.modules)
  const [turningOff, setTurningOff] = useState<PulsoModule | null>(null)
  const { setFeatures, isBusy, error } = usePulsoActions()
  const current = { modules: enabled }
  const base = modules.filter((module) => module.kind === 'base')
  const optional = modules.filter((module) => module.switchable)
  const dependents = turningOff ? dependentModules(modules, current, turningOff.code) : []

  const save = async (next: string[]) => {
    const previous = enabled
    setEnabled(next)
    if (await setFeatures(company.id, next)) onChanged()
    else setEnabled(previous)
  }

  const toggle = (module: PulsoModule, on: boolean) => {
    if (on) void save([...enabled, module.code])
    else setTurningOff(module)
  }

  return (
    <div className="space-y-6">
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <section>
        <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-sm font-semibold text-slate-900">{KIND_LABELS.optional}</h3>
          <p className="text-xs text-slate-500">{KIND_DESCRIPTIONS.optional}</p>
        </div>
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {optional.map((module) => (
            <ModuleToggleRow
              key={module.code}
              module={module}
              enabled={enabled.includes(module.code)}
              busy={isBusy}
              missing={missingRequirements(modules, current, module)}
              needs={switchableRequirements(modules, module).map((code) => moduleName(modules, code))}
              onToggle={toggle}
            />
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-sm font-semibold text-slate-900">{KIND_LABELS.base}</h3>
          <p className="text-xs text-slate-500">{KIND_DESCRIPTIONS.base}</p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {base.map((module) => {
            const Icon = module.icon
            return (
              <li key={module.code} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5" title={module.description}>
                <Icon className="size-4 shrink-0 text-slate-500" />
                <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{module.name}</span>
                <Lock className="size-3.5 shrink-0 text-slate-400" aria-label="Incluido" />
              </li>
            )
          })}
        </ul>
      </section>

      <ConfirmDialog
        open={turningOff !== null}
        onClose={() => setTurningOff(null)}
        onConfirm={() => {
          if (turningOff) {
            const dropped = new Set([turningOff.code, ...dependents.map((module) => module.code)])
            void save(enabled.filter((code) => !dropped.has(code)))
          }
          setTurningOff(null)
        }}
        title={`¿Apagar ${turningOff?.name ?? ''}?`}
        description={
          `${company.tradeName} dejará de verlo en Pulso. Sus datos se conservan y vuelven si lo enciendes otra vez.` +
          (dependents.length ? ` También se apaga: ${dependents.map((module) => module.name).join(', ')}.` : '')
        }
        confirmLabel="Apagar"
        destructive
      />
    </div>
  )
}
