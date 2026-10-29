import type { HTMLAttributes } from 'react'
import type { TableCellProps, TableHeadCellProps } from '@/types/ui.types'
import { cn } from '@/utils/cn'

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full min-w-[640px] text-left text-sm', className)} {...props} />
    </div>
  )
}

export function THead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('border-b border-slate-200 bg-slate-50/70', className)} {...props} />
}

export function TBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-slate-100', className)} {...props} />
}

export function Tr({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('transition hover:bg-slate-50/60', className)} {...props} />
}

export function Th({ className, ...props }: TableHeadCellProps) {
  return <th className={cn('px-5 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-slate-500 uppercase', className)} {...props} />
}

export function Td({ className, ...props }: TableCellProps) {
  return <td className={cn('px-5 py-3.5 align-middle text-slate-700', className)} {...props} />
}
