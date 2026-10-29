import { Plus } from 'lucide-react'
import { useState } from 'react'
import { EmptyRow } from '@/components/common/EmptyRow'
import { FormField } from '@/components/common/FormField'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { DOCUMENT_TYPE_LABELS } from '@/config/labels'
import type { DocumentType } from '@/types/common.types'
import type { SeriesTabProps } from '../types/company.types'

const TYPE_OPTIONS = (Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map((value) => ({ value, label: DOCUMENT_TYPE_LABELS[value] }))

export function SeriesTab({ series }: SeriesTabProps) {
  const [creating, setCreating] = useState(false)
  const [type, setType] = useState<string>('FACTURA')

  return (
    <>
      <CardHeader className="items-center pb-3">
        <div>
          <CardTitle>Series</CardTitle>
          <CardDescription>Sin una serie default, la empresa no puede emitir ese tipo de documento.</CardDescription>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" />
          Nueva serie
        </Button>
      </CardHeader>
      <div className="border-t border-slate-100">
        <Table>
          <THead>
            <Tr>
              <Th>Tipo</Th>
              <Th>Serie</Th>
              <Th>Último número</Th>
              <Th>Default</Th>
              <Th>Estado</Th>
              <Th className="text-right">Acciones</Th>
            </Tr>
          </THead>
          <TBody>
            {series.length === 0 && <EmptyRow colSpan={6} message="La empresa no tiene series. Sin una serie default no puede emitir." />}
            {series.map((item) => (
              <Tr key={item.id}>
                <Td>{DOCUMENT_TYPE_LABELS[item.documentType]}</Td>
                <Td className="font-mono font-medium text-slate-900">{item.series}</Td>
                <Td className="font-mono">{item.lastNumber}</Td>
                <Td>{item.isDefault && <Badge tone="info" dot={false}>Default</Badge>}</Td>
                <Td>
                  <StatusBadge status={item.isActive ? 'active' : 'disabled'} />
                </Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    {!item.isDefault && item.isActive && (
                      <Button variant="ghost" size="sm">
                        Marcar default
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      Último número
                    </Button>
                    <Button variant={item.isActive ? 'danger-ghost' : 'ghost'} size="sm">
                      {item.isActive ? 'Desactivar' : 'Activar'}
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>

      <Dialog
        open={creating}
        onClose={() => setCreating(false)}
        title="Nueva serie"
        description="La serie debe empezar con la letra que exige SUNAT para el tipo de documento."
        footer={
          <>
            <Button variant="outline" onClick={() => setCreating(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setCreating(false)}>Crear serie</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Tipo de documento" htmlFor="series-type">
            <Select id="series-type" value={type} onValueChange={setType} options={TYPE_OPTIONS} />
          </FormField>
          <FormField label="Serie" htmlFor="series-code" hint="Factura: F, Boleta: B, GRE Remitente: T, GRE Transportista: V.">
            <Input id="series-code" placeholder="F002" maxLength={4} className="font-mono uppercase" />
          </FormField>
        </div>
      </Dialog>
    </>
  )
}
