import { Badge } from '@/components/ui/badge'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import type { GenerationStatus, GeneratedTableProps, StatusConfig } from '../types/template.types'

const STATUS_CONFIG: Record<GenerationStatus, StatusConfig> = {
  ready: { label: 'Listo', tone: 'success' },
  processing: { label: 'Generando', tone: 'info' },
  failed: { label: 'Falló', tone: 'danger' },
}

export function GeneratedTable({ documents }: GeneratedTableProps) {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>Plantilla</Th>
          <Th>Sistema</Th>
          <Th>Estado</Th>
          <Th className="text-right">Tamaño</Th>
          <Th>Cuándo</Th>
        </Tr>
      </THead>
      <TBody>
        {documents.map((document) => {
          const { label, tone } = STATUS_CONFIG[document.status]
          return (
            <Tr key={document.id}>
              <Td className="font-medium text-slate-900">{document.templateName}</Td>
              <Td>{document.systemName}</Td>
              <Td>
                <Badge tone={tone}>{label}</Badge>
              </Td>
              <Td className="text-right tabular-nums">{document.size ?? '—'}</Td>
              <Td className="text-slate-500">{document.createdAt}</Td>
            </Tr>
          )
        })}
      </TBody>
    </Table>
  )
}
