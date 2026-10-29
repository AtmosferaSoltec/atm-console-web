import { FormField } from '@/components/common/FormField'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { SessionMode, SessionPolicyFieldsProps } from '../types/system.types'

export const MIN_SESSION_MINUTES = 5
export const MAX_SESSION_MINUTES = 1440

const MODE_OPTIONS: { value: SessionMode; label: string }[] = [
  { value: 'persistent', label: 'Persistente: recuerda al usuario' },
  { value: 'temporary', label: 'Temporal: pide ingresar de nuevo' },
]

/** True when the policy can be sent: persistent, or temporary with minutes inside the allowed range. */
export function isSessionPolicyValid(mode: SessionMode, minutes: string): boolean {
  if (mode === 'persistent') return true
  const value = Number(minutes)
  return Number.isInteger(value) && value >= MIN_SESSION_MINUTES && value <= MAX_SESSION_MINUTES
}

export function SessionPolicyFields({ idPrefix, mode, minutes, onModeChange, onMinutesChange }: SessionPolicyFieldsProps) {
  return (
    <>
      <FormField
        label="Sesión de los usuarios"
        htmlFor={`${idPrefix}-session-mode`}
        hint={
          mode === 'persistent'
            ? 'El usuario sigue dentro la próxima vez que abra el sistema, como en Facebook.'
            : 'Si pasa el tiempo sin actividad, el usuario tiene que ingresar de nuevo. Pensado para equipos compartidos.'
        }
      >
        <Select id={`${idPrefix}-session-mode`} value={mode} onValueChange={(value) => onModeChange(value as SessionMode)} options={MODE_OPTIONS} />
      </FormField>
      {mode === 'temporary' && (
        <FormField
          label="Minutos sin actividad"
          htmlFor={`${idPrefix}-session-minutes`}
          hint={`Entre ${MIN_SESSION_MINUTES} y ${MAX_SESSION_MINUTES} minutos.`}
          error={minutes !== '' && !isSessionPolicyValid(mode, minutes) ? `Debe estar entre ${MIN_SESSION_MINUTES} y ${MAX_SESSION_MINUTES}.` : undefined}
        >
          <Input
            id={`${idPrefix}-session-minutes`}
            inputMode="numeric"
            maxLength={4}
            placeholder="Ingresa los minutos"
            className="font-mono"
            value={minutes}
            onChange={(event) => onMinutesChange(event.target.value.replace(/\D/g, ''))}
          />
        </FormField>
      )}
    </>
  )
}
