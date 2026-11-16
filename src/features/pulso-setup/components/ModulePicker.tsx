import { Check, Lock } from 'lucide-react'
import { cn } from '@/utils/cn'
import { moduleName, switchableRequirements } from '../services/moduleCatalog'
import type { ModulePickerProps } from '../types/pulsoSetup.types'

/**
 * The optional modules as selectable tiles, for creating companies. Base modules are listed as included. Picking a
 * module also picks what it needs; dropping one drops what depends on it.
 */
export function ModulePicker({ modules, selected, onChange }: ModulePickerProps) {
  const available = modules.filter((module) => module.switchable)
  const base = modules.filter((module) => module.kind === 'base')
  const find = (code: string) => modules.find((module) => module.code === code)

  const toggle = (code: string) => {
    if (selected.includes(code)) {
      onChange(selected.filter((item) => item !== code && !find(item)?.requires.includes(code)))
      return
    }
    const needed = (find(code)?.requires ?? []).filter((item) => find(item)?.switchable && !selected.includes(item))
    onChange([...selected, ...needed, code])
  }

  return (
    <div className="space-y-3">
      <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-slate-500">
        <Lock className="size-3.5" />
        Incluidos siempre: {base.map((module) => module.name).join(', ')}.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {available.map((module) => {
          const on = selected.includes(module.code)
          const Icon = module.icon
          const needs = switchableRequirements(modules, module)
          return (
            <button
              key={module.code}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(module.code)}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-left transition',
                on ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500' : 'border-slate-200 hover:bg-slate-50',
              )}
            >
              <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-md', on ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500')}>
                {on ? <Check className="size-4" /> : <Icon className="size-4" />}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-900">{module.name}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{module.description}</span>
                {needs.length > 0 && <span className="mt-1.5 block text-xs text-amber-700">Necesita {needs.map((code) => moduleName(modules, code)).join(' y ')}</span>}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
