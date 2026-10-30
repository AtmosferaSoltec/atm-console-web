import { EmptyRow } from '@/components/common/EmptyRow'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { formatNumber } from '@/utils/format'
import type { BreakdownTableProps } from '../types/activity.types'

const COLUMNS = 3

export function BreakdownTable({ rows, nameLabel, labelFor, emptyMessage }: BreakdownTableProps) {
  return (
    <Table className="min-w-0">
      <THead>
        <Tr>
          <Th>{nameLabel}</Th>
          <Th className="text-right">Correctos</Th>
          <Th className="text-right">Con problemas</Th>
        </Tr>
      </THead>
      <TBody>
        {rows.length === 0 && <EmptyRow colSpan={COLUMNS} message={emptyMessage} />}
        {rows.map((row) => (
          <Tr key={row.name}>
            <Td className="font-medium text-slate-900">{labelFor(row.name)}</Td>
            <Td className="text-right tabular-nums">{formatNumber(row.ok)}</Td>
            <Td className="text-right tabular-nums">{formatNumber(row.failed)}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
