import { Td, Tr } from '@/components/ui/table'
import type { EmptyRowProps } from '@/types/ui.types'

export function EmptyRow({ colSpan, message }: EmptyRowProps) {
  return (
    <Tr>
      <Td colSpan={colSpan} className="py-10 text-center text-slate-500">
        {message}
      </Td>
    </Tr>
  )
}
