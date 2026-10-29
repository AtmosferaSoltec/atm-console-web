import { CalendarRange } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { DateRangePickerProps } from '@/types/ui.types'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/format'

function describeRange(value: DateRangePickerProps['value'], placeholder: string): string {
  if (!value?.from) return placeholder
  if (!value.to) return formatDate(value.from)
  return `${formatDate(value.from)} – ${formatDate(value.to)}`
}

export function DateRangePicker({ value, onChange, presets = [], placeholder = 'Selecciona un rango', className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-left text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15',
            value?.from ? 'text-slate-900' : 'text-slate-400',
            className,
          )}
        >
          <CalendarRange className="size-4 shrink-0 text-slate-400" />
          <span className="truncate">{describeRange(value, placeholder)}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[calc(100vw-2rem)]">
        <div className="flex flex-col sm:flex-row">
          {presets.length > 0 && (
            <div className="flex gap-1 overflow-x-auto border-b border-slate-100 p-2 sm:w-44 sm:flex-col sm:border-r sm:border-b-0">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    onChange(preset.getRange())
                    setOpen(false)
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}
          <Calendar mode="range" selected={value} onSelect={onChange} numberOfMonths={1} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
