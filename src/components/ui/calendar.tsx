import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, type DayPickerProps } from 'react-day-picker'
import { es } from 'react-day-picker/locale'
import { cn } from '@/utils/cn'

const NAV_BUTTON = 'flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900'

export function Calendar({ className, ...props }: DayPickerProps) {
  const isRange = props.mode === 'range'

  return (
    <DayPicker
      locale={es}
      showOutsideDays
      weekStartsOn={1}
      className={cn('p-3', className)}
      classNames={{
        root: 'w-fit',
        months: 'relative flex flex-col gap-4 sm:flex-row',
        month: 'space-y-2',
        month_caption: 'flex h-9 items-center justify-center',
        caption_label: 'text-sm font-semibold text-slate-900 capitalize',
        nav: 'absolute inset-x-0 top-0 z-10 flex h-9 items-center justify-between',
        button_previous: NAV_BUTTON,
        button_next: NAV_BUTTON,
        month_grid: 'border-collapse',
        weekday: 'size-9 text-center text-[11px] font-medium text-slate-400 uppercase',
        day: 'p-0 text-center text-sm',
        day_button:
          'size-9 cursor-pointer rounded-lg text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-600',
        today: '[&>button]:font-bold [&>button]:text-brand-700',
        outside: '[&>button]:text-slate-300',
        disabled: 'opacity-40',
        hidden: 'invisible',
        ...(isRange
          ? {
              range_start: '[&>button]:bg-brand-600 [&>button]:text-white [&>button:hover]:bg-brand-700',
              range_end: '[&>button]:bg-brand-600 [&>button]:text-white [&>button:hover]:bg-brand-700',
              range_middle: 'bg-brand-50 [&>button]:rounded-none [&>button]:bg-transparent [&>button]:text-brand-800',
            }
          : { selected: '[&>button]:bg-brand-600 [&>button]:text-white [&>button:hover]:bg-brand-700' }),
      }}
      components={{
        Chevron: ({ orientation }) => (orientation === 'left' ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />),
      }}
      {...props}
    />
  )
}
