import { Label } from '@/components/ui/label'
import type { FilterFieldProps } from '@/types/ui.types'

export function FilterField({ label, htmlFor, children }: FilterFieldProps) {
  return (
    <div className="flex flex-col">
      <Label htmlFor={htmlFor} className="mb-1 text-xs text-slate-500">
        {label}
      </Label>
      {children}
    </div>
  )
}
