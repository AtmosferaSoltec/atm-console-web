import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useUpdateSystemSession } from '../hooks/useUpdateSystemSession'
import type { SessionMode, SystemSessionCardProps } from '../types/system.types'
import { isSessionPolicyValid, SessionPolicyFields } from './SessionPolicyFields'

const DEFAULT_MINUTES = '30'

export function SystemSessionCard({ system, onChanged }: SystemSessionCardProps) {
  const [mode, setMode] = useState<SessionMode>(system.sessionMode)
  const [minutes, setMinutes] = useState(system.sessionMinutes > 0 ? String(system.sessionMinutes) : DEFAULT_MINUTES)
  const { save, isSaving, saved, error, clearFeedback } = useUpdateSystemSession()

  const changed = mode !== system.sessionMode || (mode === 'temporary' && Number(minutes) !== system.sessionMinutes)
  const canSave = changed && isSessionPolicyValid(mode, minutes) && !isSaving

  const handleSave = async () => {
    if (await save(system.id, { mode, minutes: mode === 'temporary' ? Number(minutes) : 0 })) onChanged()
  }

  return (
    <Card className="mb-6 p-5">
      <h2 className="text-sm font-semibold text-slate-900">Sesión de los usuarios</h2>
      <p className="mt-0.5 mb-4 text-sm text-slate-500">
        Cada sistema decide cuánto se queda abierta la sesión. Quien ya está dentro toma el cambio cuando se le renueva la sesión.
      </p>
      <div className="max-w-md space-y-4">
        <SessionPolicyFields
          idPrefix="system"
          mode={mode}
          minutes={minutes}
          onModeChange={(next) => {
            setMode(next)
            clearFeedback()
          }}
          onMinutesChange={(next) => {
            setMinutes(next)
            clearFeedback()
          }}
        />
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={!canSave}>
            {isSaving ? 'Guardando...' : 'Guardar sesión'}
          </Button>
          {saved && <span className="text-sm text-emerald-600">Guardado.</span>}
          {error && (
            <span role="alert" className="text-sm text-red-600">
              {error}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
