import { FormField } from '@/components/common/FormField'
import { Select } from '@/components/ui/select'
import type { SessionMode, SessionPolicyFieldsProps } from '../types/system.types'

const MODE_OPTIONS: { value: SessionMode; label: string }[] = [
  { value: 'persistent', label: 'Persistente: recuerda al usuario' },
  { value: 'temporary', label: 'Temporal: pide ingresar de nuevo' },
]

const MODE_HINTS: Record<SessionMode, string> = {
  persistent: 'El usuario no vuelve a ingresar mientras use el sistema; solo si pasan 90 días sin entrar.',
  temporary: 'El usuario ingresa cada vez que abre el sistema; si cierra la pestaña o la sesión, tiene que ingresar de nuevo. Pensado para equipos compartidos.',
}

export function SessionPolicyFields({ idPrefix, mode, onModeChange }: SessionPolicyFieldsProps) {
  return (
    <FormField label="Sesión de los usuarios" htmlFor={`${idPrefix}-session-mode`} hint={MODE_HINTS[mode]}>
      <Select id={`${idPrefix}-session-mode`} value={mode} onValueChange={(value) => onModeChange(value as SessionMode)} options={MODE_OPTIONS} />
    </FormField>
  )
}
