import { EmptyRow } from '@/components/common/EmptyRow'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { formatPhone } from '@/utils/format'
import type { MessagesTableProps } from '../types/message.types'
import { describeMessageError, MessageKindLabel, MessagePriorityBadge, MessageStatusBadge } from './MessageBadges'

export function MessagesTable({ messages, compact = false }: MessagesTableProps) {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>Cuándo</Th>
          <Th>Empresa</Th>
          <Th>Destino</Th>
          <Th>Tipo</Th>
          {!compact && <Th>Prioridad</Th>}
          <Th>Estado</Th>
          {!compact && <Th className="text-right">Intentos</Th>}
        </Tr>
      </THead>
      <TBody>
        {messages.length === 0 && <EmptyRow colSpan={compact ? 5 : 7} message="No hay mensajes con estos filtros." />}
        {messages.map((message) => (
          <Tr key={message.id}>
            <Td className="whitespace-nowrap text-slate-500">{message.when}</Td>
            <Td>
              <p className="font-medium text-slate-900">{message.accountRef}</p>
              <p className="text-xs text-slate-400">{message.clientName}</p>
            </Td>
            <Td className="whitespace-nowrap">{formatPhone(message.recipient)}</Td>
            <Td>
              <MessageKindLabel kind={message.kind} />
            </Td>
            {!compact && (
              <Td>
                <MessagePriorityBadge priority={message.priority} />
              </Td>
            )}
            <Td>
              <MessageStatusBadge status={message.status} />
              {message.error && <p className="mt-1 text-xs text-red-500">{describeMessageError(message.error)}</p>}
            </Td>
            {!compact && <Td className="text-right tabular-nums">{message.attempts}</Td>}
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
