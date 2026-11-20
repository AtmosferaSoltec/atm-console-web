import { Palette } from 'lucide-react'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { BRAND_COLORS, normalizeHex } from '../services/brandColor'
import type { ColorFieldProps } from '../types/pulsoSetup.types'

/** Quick swatches, a HEX field and a picker. The colour is only saved with the "Guardar color" button. */
export function ColorField({ value, onSave, busy, error }: ColorFieldProps) {
  const [text, setText] = useState(value)
  const parsed = normalizeHex(text)
  const invalid = text.trim() !== '' && !parsed
  const draft = parsed ?? value
  const canSave = !!parsed && parsed !== value && !busy
  const swatches = BRAND_COLORS.includes(value) ? BRAND_COLORS : [...BRAND_COLORS, value]

  const save = async () => {
    if (!parsed) return
    if (await onSave(parsed)) setText(parsed)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Colores rápidos">
        {swatches.map((item) => (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={draft === item}
            aria-label={item}
            onClick={() => setText(item)}
            className="size-8 cursor-pointer rounded-full ring-offset-2 transition aria-checked:ring-2 aria-checked:ring-slate-900"
            style={{ backgroundColor: item }}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-2">
        <div className="w-40">
          <Input
            aria-label="Código HEX del color"
            placeholder="#17677b"
            value={text}
            invalid={invalid}
            maxLength={7}
            spellCheck={false}
            autoComplete="off"
            onChange={(event) => setText(event.target.value)}
            onBlur={() => parsed && setText(parsed)}
            onKeyDown={(event) => event.key === 'Enter' && void save()}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" aria-label="Abrir selector de color">
              <span className="size-4 rounded-full border border-slate-200" style={{ backgroundColor: draft }} />
              <Palette className="size-4" />
              Selector
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-3">
            <HexColorPicker color={draft} onChange={setText} style={{ width: '100%' }} />
          </PopoverContent>
        </Popover>
        <Button disabled={!canSave} onClick={() => void save()}>
          Guardar color
        </Button>
      </div>

      {invalid && (
        <p role="alert" className="text-sm text-red-600">
          Escribe un código HEX válido, por ejemplo #17677b.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
