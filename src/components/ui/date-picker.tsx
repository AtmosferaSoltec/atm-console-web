import { CalendarDays } from 'lucide-react'
import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { DatePickerProps } from '@/types/ui.types'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/format'

export function DatePicker({ value, onChange, placeholder = 'Selecciona una fecha', className }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-left text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15',
            value ? 'text-slate-900' : 'text-slate-400',
            className,
          )}
        >
          <CalendarDays className="size-4 shrink-0 text-slate-400" />
          <span className="truncate">{value ? formatDate(value) : placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
