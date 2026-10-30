import { Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { usePulsoActions } from '../hooks/usePulsoActions'
import type { GymColorFieldProps } from '../types/pulso.types'

/** The colour of the gym in its app. A colour picker is not in the shared UI kit, so the native one is used. */
export function GymColorField({ gym, onSaved }: GymColorFieldProps) {
  const [color, setColor] = useState(gym.brandColor)
  const { setColor: save, isBusy, error } = usePulsoActions()
  const changed = color.toLowerCase() !== gym.brandColor.toLowerCase()

  const handleSave = async () => {
    if (await save(gym.id, color.toLowerCase())) onSaved()
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        aria-label={`Color de ${gym.name}`}
        title="Color"
        value={color}
        onChange={(event) => setColor(event.target.value)}
        className="size-8 cursor-pointer rounded-lg border border-slate-200 bg-white p-0.5"
      />
      {changed && (
        <Button variant="ghost" size="icon" aria-label="Guardar color" title="Guardar color" disabled={isBusy} onClick={() => void handleSave()}>
          <Check className="size-4" />
        </Button>
      )}
      {error && (
        <span role="alert" className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  )
}
