import { Eye } from 'lucide-react'
import { EmptyRow } from '@/components/common/EmptyRow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import type { TemplatesTableProps } from '../types/template.types'

const COLUMNS = 4

export function TemplatesTable({ templates, emptyMessage, onPreview }: TemplatesTableProps) {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>Plantilla</Th>
          <Th>Formatos</Th>
          <Th>Se usa con</Th>
          <Th className="text-right">Vista previa</Th>
        </Tr>
      </THead>
      <TBody>
        {templates.length === 0 && <EmptyRow colSpan={COLUMNS} message={emptyMessage} />}
        {templates.map((template) => (
          <Tr key={template.code}>
            <Td>
              <p className="font-medium text-slate-900">{template.name}</p>
              <p className="mt-0.5 max-w-md text-xs text-slate-500">{template.description}</p>
            </Td>
            <Td>
              <div className="flex flex-wrap gap-1.5">
                {template.formats.map((format) => (
                  <Badge key={format.code} tone="info" dot={false} title={format.paper}>
                    {format.label}
                  </Badge>
                ))}
              </div>
            </Td>
            <Td className="font-mono text-xs whitespace-nowrap text-slate-600">{template.endpoint}</Td>
            <Td className="text-right">
              <Button variant="outline" size="sm" onClick={() => onPreview(template)}>
                <Eye className="size-4" />
                Ver ejemplo
              </Button>
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
