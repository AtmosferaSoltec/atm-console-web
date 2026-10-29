import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { CopyField } from '@/components/common/CopyField'
import { EmptyRow } from '@/components/common/EmptyRow'
import { FormField } from '@/components/common/FormField'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import type { CompanyApiKey, ApiKeysTabProps } from '../types/company.types'

export function ApiKeysTab({ keys }: ApiKeysTabProps) {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [revoking, setRevoking] = useState<CompanyApiKey | null>(null)

  const closeGenerate = () => {
    setGenerating(false)
    setGenerated(false)
  }

  return (
    <>
      <CardHeader className="items-center pb-3">
        <div>
          <CardTitle>API keys</CardTitle>
          <CardDescription>Las llaves con las que los sistemas de la empresa emiten por la API.</CardDescription>
        </div>
        <Button onClick={() => setGenerating(true)}>
          <Plus className="size-4" />
          Generar key
        </Button>
      </CardHeader>
      <div className="border-t border-slate-100">
        <Table>
          <THead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Key</Th>
              <Th>Creada</Th>
              <Th>Último uso</Th>
              <Th>Estado</Th>
              <Th className="w-10" />
            </Tr>
          </THead>
          <TBody>
            {keys.length === 0 && <EmptyRow colSpan={6} message="La empresa no tiene API keys." />}
            {keys.map((key) => (
              <Tr key={key.id}>
                <Td className="font-medium text-slate-900">{key.label}</Td>
                <Td>
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">{key.prefix}…</code>
                </Td>
                <Td className="text-slate-500">{key.createdAt}</Td>
                <Td className="text-slate-500">{key.lastUsedAt ?? 'Nunca'}</Td>
                <Td>
                  <StatusBadge status={key.isActive ? 'active' : 'disabled'} />
                </Td>
                <Td>
                  {key.isActive && (
                    <Button variant="danger-ghost" size="sm" onClick={() => setRevoking(key)}>
                      Revocar
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>

      <Dialog
        open={generating}
        onClose={closeGenerate}
        title={generated ? 'API key generada' : 'Generar API key'}
        description={generated ? 'Guárdala ahora: no se volverá a mostrar.' : 'Ponle un nombre para saber quién la usa.'}
        footer={
          generated ? (
            <Button onClick={closeGenerate}>Listo, ya la guardé</Button>
          ) : (
            <>
              <Button variant="outline" onClick={closeGenerate}>
                Cancelar
              </Button>
              <Button onClick={() => setGenerated(true)}>Generar</Button>
            </>
          )
        }
      >
        {generated ? (
          <CopyField value="atm_nbf_live_Hq72zXc9Lr0TnB4yWm8sUa1DfE5pJk3V" />
        ) : (
          <FormField label="Nombre" htmlFor="key-label">
            <Input id="key-label" placeholder="Sistema de ventas" />
          </FormField>
        )}
      </Dialog>

      <ConfirmDialog
        open={revoking !== null}
        onClose={() => setRevoking(null)}
        onConfirm={() => setRevoking(null)}
        title="¿Revocar esta API key?"
        description={`${revoking?.label ?? ''} dejará de funcionar al instante. No se puede deshacer.`}
        confirmLabel="Revocar"
        destructive
      />
    </>
  )
}
