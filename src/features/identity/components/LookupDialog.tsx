import { Database } from 'lucide-react'
import { useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { DetailList } from '@/components/common/DetailList'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { IdentityDialogProps, LookupKind } from '../types/identity.types'

const LENGTHS: Record<LookupKind, number> = { persons: 8, companies: 11 }

export function LookupDialog({ open, onClose }: IdentityDialogProps) {
  const [kind, setKind] = useState<LookupKind>('persons')
  const [number, setNumber] = useState('')
  const [searched, setSearched] = useState(false)

  const close = () => {
    setSearched(false)
    setNumber('')
    onClose()
  }

  const canSearch = number.length === LENGTHS[kind]

  return (
    <Dialog
      open={open}
      onClose={close}
      size="lg"
      title="Consultar documento"
      description="Busca primero en la base de datos. Si no está, gasta una consulta del proveedor y lo guarda."
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cerrar
          </Button>
          <Button disabled={!canSearch} onClick={() => setSearched(true)}>
            Consultar
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <FormField label="Tipo" htmlFor="lookup-kind">
            <Select
              id="lookup-kind"
              value={kind}
              onValueChange={(value) => {
                setKind(value as LookupKind)
                setNumber('')
                setSearched(false)
              }}
              options={[
                { value: 'persons', label: 'DNI' },
                { value: 'companies', label: 'RUC' },
              ]}
            />
          </FormField>
          <FormField label="Número" htmlFor="lookup-number" hint={`${LENGTHS[kind]} dígitos`}>
            <Input
              id="lookup-number"
              inputMode="numeric"
              maxLength={LENGTHS[kind]}
              className="font-mono"
              placeholder={kind === 'persons' ? '74455518' : '20131312955'}
              value={number}
              onChange={(event) => {
                setNumber(event.target.value.replace(/\D/g, ''))
                setSearched(false)
              }}
            />
          </FormField>
        </div>

        {searched && (
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-900">Resultado</p>
              <Badge tone="success">
                <Database className="size-3" />
                Desde la base de datos
              </Badge>
            </div>
            <DetailList
              items={
                kind === 'persons'
                  ? [
                      { label: 'Nombres', value: 'JOHN' },
                      { label: 'Apellido paterno', value: 'DOE' },
                      { label: 'Apellido materno', value: 'ROE' },
                    ]
                  : [
                      { label: 'Razón social', value: 'EMPRESA DE EJEMPLO S.A.C.' },
                      { label: 'Nombre comercial', value: null },
                      { label: 'Dirección', value: 'AV. EJEMPLO 123 - LIMA' },
                    ]
              }
            />
          </div>
        )}
      </div>
    </Dialog>
  )
}
