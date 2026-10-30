import { EmptyRow } from '@/components/common/EmptyRow'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { formatBytes, formatNumber } from '@/utils/format'
import type { UsageTableProps } from '../types/storage.types'

const COLUMNS = 4

export function UsageTable({ usage, totalBytes, systemNames, emptyMessage }: UsageTableProps) {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>Origen</Th>
          <Th className="text-right">Archivos</Th>
          <Th className="text-right">Espacio</Th>
          <Th className="w-56">Del total</Th>
        </Tr>
      </THead>
      <TBody>
        {usage.length === 0 && <EmptyRow colSpan={COLUMNS} message={emptyMessage} />}
        {usage.map((item) => (
          <Tr key={`${item.scope}:${item.system}`}>
            <Td className="font-medium text-slate-900">
              {item.scope === 'company' ? (
                <Badge tone="violet" dot={false}>
                  Logos de empresas
                </Badge>
              ) : (
                (systemNames[item.system] ?? item.system)
              )}
            </Td>
            <Td className="text-right tabular-nums">{formatNumber(item.filesCount)}</Td>
            <Td className="text-right tabular-nums">{formatBytes(item.totalBytes)}</Td>
            <Td>
              <ProgressBar value={item.totalBytes} max={totalBytes} />
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
