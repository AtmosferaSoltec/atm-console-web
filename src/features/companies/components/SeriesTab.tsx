import { Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
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
import { useCompanyAction } from '../hooks/useCompanyAction'
import { createSeries, updateSeries } from '../services/companyService'
import type { CompanySeries, SeriesTabProps } from '../types/company.types'

const TYPE_OPTIONS = (Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map((value) => ({ value, label: DOCUMENT_TYPE_LABELS[value] }))

export function SeriesTab({ companyId, series, isLoading, error, onChanged }: SeriesTabProps) {
  const [creating, setCreating] = useState(false)
  const [type, setType] = useState<DocumentType>('FACTURA')
  const [code, setCode] = useState('')
  const [editingLast, setEditingLast] = useState<CompanySeries | null>(null)
  const [lastNumber, setLastNumber] = useState('')
  const create = useCompanyAction()
  const change = useCompanyAction()

  const closeCreate = () => {
    setCreating(false)
    setCode('')
    create.clearError()
  }

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault()
    if (code.trim() === '') return
    if (await create.run(() => createSeries(companyId, { documentType: type, series: code.trim().toUpperCase() }))) {
      closeCreate()
      onChanged()
    }
  }

  const apply = async (action: () => Promise<unknown>) => {
    if (await change.run(action)) onChanged()
  }

  const closeLast = () => {
    setEditingLast(null)
    change.clearError()
  }

  const saveLast = async (event: FormEvent) => {
    event.preventDefault()
    const value = Number(lastNumber)
    if (!editingLast || !Number.isInteger(value) || value < 0) return
    if (await change.run(() => updateSeries(editingLast.id, { lastNumber: value }))) {
      closeLast()
      onChanged()
    }
  }

  const emptyMessage = isLoading ? 'Cargando series...' : (error ?? 'La empresa no tiene series. Sin una serie default no puede emitir.')

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
      {change.error && editingLast === null && (
        <p role="alert" className="px-5 pb-3 text-sm text-red-600">
          {change.error}
        </p>
      )}
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
            {series.length === 0 && <EmptyRow colSpan={6} message={emptyMessage} />}
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
                      <Button variant="ghost" size="sm" disabled={change.isBusy} onClick={() => apply(() => updateSeries(item.id, { isDefault: true }))}>
                        Marcar default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={change.isBusy}
                      onClick={() => {
                        setLastNumber(String(item.lastNumber))
                        setEditingLast(item)
                      }}
                    >
                      Último número
                    </Button>
                    <Button
                      variant={item.isActive ? 'danger-ghost' : 'ghost'}
                      size="sm"
                      disabled={change.isBusy}
                      onClick={() => apply(() => updateSeries(item.id, { isActive: !item.isActive }))}
                    >
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
        onClose={closeCreate}
        title="Nueva serie"
        description="La serie debe empezar con la letra que exige SUNAT para el tipo de documento."
        footer={
          <>
            <Button variant="outline" onClick={closeCreate}>
              Cancelar
            </Button>
            <Button type="submit" form="create-series-form" disabled={code.trim() === '' || create.isBusy}>
              {create.isBusy ? 'Creando...' : 'Crear serie'}
            </Button>
          </>
        }
      >
        <form id="create-series-form" onSubmit={handleCreate} onChange={create.clearError} className="space-y-4">
          <FormField label="Tipo de documento" htmlFor="series-type">
            <Select id="series-type" value={type} onValueChange={(value) => setType(value as DocumentType)} options={TYPE_OPTIONS} />
          </FormField>
          <FormField label="Serie" htmlFor="series-code" hint="Factura: F, Boleta: B, GRE Remitente: T, GRE Transportista: V.">
            <Input id="series-code" placeholder="F002" maxLength={4} className="font-mono uppercase" value={code} onChange={(event) => setCode(event.target.value)} />
          </FormField>
          {create.error && (
            <p role="alert" className="text-sm text-red-600">
              {create.error}
            </p>
          )}
        </form>
      </Dialog>

      <Dialog
        open={editingLast !== null}
        onClose={closeLast}
        title={`Último número de ${editingLast?.series ?? ''}`}
        description="El siguiente documento saldrá con el número siguiente a este. Súbelo solo si la empresa ya emitía con esta serie desde otro sistema."
        footer={
          <>
            <Button variant="outline" onClick={closeLast}>
              Cancelar
            </Button>
            <Button type="submit" form="last-number-form" disabled={change.isBusy}>
              {change.isBusy ? 'Guardando...' : 'Guardar'}
            </Button>
          </>
        }
      >
        <form id="last-number-form" onSubmit={saveLast} onChange={change.clearError} className="space-y-4">
          <FormField label="Último número emitido" htmlFor="last-number">
            <Input id="last-number" type="number" min={0} className="font-mono" value={lastNumber} onChange={(event) => setLastNumber(event.target.value)} />
          </FormField>
          {change.error && (
            <p role="alert" className="text-sm text-red-600">
              {change.error}
            </p>
          )}
        </form>
      </Dialog>
    </>
  )
}
