import { Mail, FileText } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import type { TemplatesTableProps } from '../types/template.types'

export function TemplatesTable({ templates }: TemplatesTableProps) {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>Plantilla</Th>
          <Th>Sistema</Th>
          <Th>Formato</Th>
          <Th>Versión</Th>
          <Th>Estado</Th>
          <Th>Actualizada</Th>
        </Tr>
      </THead>
      <TBody>
        {templates.map((template) => (
          <Tr key={template.id}>
            <Td className="font-medium text-slate-900">{template.name}</Td>
            <Td>{template.systemName}</Td>
            <Td>
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                {template.format === 'pdf' ? <FileText className="size-4 text-slate-400" /> : <Mail className="size-4 text-slate-400" />}
                {template.format === 'pdf' ? 'PDF' : 'Correo'}
              </span>
            </Td>
            <Td className="font-mono text-slate-600">v{template.version}</Td>
            <Td>
              <StatusBadge status={template.isActive ? 'active' : 'disabled'} />
            </Td>
            <Td className="text-slate-500">{template.updatedAt}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
