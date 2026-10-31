import { useState } from 'react'
import { usePulsoActions } from '../hooks/usePulsoActions'
import type { GymFeaturesFieldProps } from '../types/pulso.types'

/** The optional modules Pulso offers, in the order the API lists them. Only the platform switches them on. */
const MODULES = [
  { code: 'sales', label: 'Ventas' },
  { code: 'body_tracking', label: 'Medidas y rutinas' },
  { code: 'kiosk', label: 'Quiosco de acceso' },
] as const

/** One switch per module; each change is saved at once. */
export function GymFeaturesField({ gym, onSaved }: GymFeaturesFieldProps) {
  const [enabled, setEnabled] = useState<string[]>(gym.features)
  const { setFeatures, isBusy, error } = usePulsoActions()

  const toggle = async (code: string, on: boolean) => {
    const next = MODULES.map((module) => module.code as string).filter((item) => (item === code ? on : enabled.includes(item)))
    const previous = enabled
    setEnabled(next)
    if (await setFeatures(gym.id, next)) onSaved()
    else setEnabled(previous)
  }

  return (
    <section>
      <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Módulos</h3>
      <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-1">
        {MODULES.map((module) => (
          <li key={module.code}>
            <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-slate-800">
              <input
                type="checkbox"
                role="switch"
                aria-label={`${module.label} en ${gym.name}`}
                checked={enabled.includes(module.code)}
                disabled={isBusy}
                onChange={(event) => void toggle(module.code, event.target.checked)}
                className="size-4 accent-slate-900"
              />
              {module.label}
            </label>
          </li>
        ))}
      </ul>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </section>
  )
}
