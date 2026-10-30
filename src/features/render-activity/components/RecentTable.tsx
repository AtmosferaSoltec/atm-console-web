import { EmptyRow } from '@/components/common/EmptyRow'
import { Badge } from '@/components/ui/badge'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import type { BadgeTone } from '@/types/ui.types'
import { formatBytes, formatDateTime } from '@/utils/format'
import { formatLabel } from '../services/activityLabels'
import type { ActivityOutcome, RecentTableProps } from '../types/activity.types'

const COLUMNS = 7

const OUTCOMES: Record<ActivityOutcome, { label: string; tone: BadgeTone }> = {
  ok: { label: 'Correcto', tone: 'success' },
  invalid: { label: 'Rechazado', tone: 'warning' },
  busy: { label: 'Saturado', tone: 'warning' },
  error: { label: 'Error', tone: 'danger' },
}

export function RecentTable({ events, systemNames, emptyMessage }: RecentTableProps) {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>Fecha</Th>
          <Th>Sistema</Th>
          <Th>Formato</Th>
          <Th className="text-right">Líneas</Th>
          <Th className="text-right">Tamaño</Th>
          <Th className="text-right">Duración</Th>
          <Th>Resultado</Th>
        </Tr>
      </THead>
      <TBody>
        {events.length === 0 && <EmptyRow colSpan={COLUMNS} message={emptyMessage} />}
        {events.map((event, index) => {
          const outcome = OUTCOMES[event.outcome]
          return (
            <Tr key={`${event.at.getTime()}:${index}`}>
              <Td className="whitespace-nowrap text-slate-500">{formatDateTime(event.at)}</Td>
              <Td className="font-medium text-slate-900">{systemNames[event.system] ?? event.system}</Td>
              <Td>{formatLabel(event.format)}</Td>
              <Td className="text-right tabular-nums">{event.items || '—'}</Td>
              <Td className="text-right tabular-nums">{event.bytes ? formatBytes(event.bytes) : '—'}</Td>
              <Td className="text-right tabular-nums">{event.durationMs} ms</Td>
              <Td>
                <Badge tone={outcome.tone}>{outcome.label}</Badge>
              </Td>
            </Tr>
          )
        })}
      </TBody>
    </Table>
  )
}
