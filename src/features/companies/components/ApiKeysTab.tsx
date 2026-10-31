import { Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
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
import { formatDate, formatDateTime } from '@/utils/format'
import { useCompanyAction } from '../hooks/useCompanyAction'
import { createApiKey, revokeApiKey } from '../services/companyService'
import type { ApiKeysTabProps, CompanyApiKey } from '../types/company.types'

export function ApiKeysTab({ companyId, keys, isLoading, error, onChanged }: ApiKeysTabProps) {
  const [generating, setGenerating] = useState(false)
  const [name, setName] = useState('')
  const [generated, setGenerated] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<CompanyApiKey | null>(null)
  const generate = useCompanyAction()
  const revoke = useCompanyAction()

  const closeGenerate = () => {
    setGenerating(false)
    setGenerated(null)
    setName('')
    generate.clearError()
  }

  const handleGenerate = async (event: FormEvent) => {
    event.preventDefault()
    if (name.trim() === '') return
    const key = await generate.run(() => createApiKey(companyId, name.trim()))
    if (key) {
      setGenerated(key)
      onChanged()
    }
  }

  const handleRevoke = async () => {
    if (!revoking) return
    if (await revoke.run(() => revokeApiKey(revoking.id))) {
      setRevoking(null)
      onChanged()
    }
  }

  const closeRevoke = () => {
    revoke.clearError()
    setRevoking(null)
  }

  const emptyMessage = isLoading ? 'Cargando API keys...' : (error ?? 'La empresa no tiene API keys.')

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
            {keys.length === 0 && <EmptyRow colSpan={6} message={emptyMessage} />}
            {keys.map((key) => (
              <Tr key={key.id}>
                <Td className="font-medium text-slate-900">{key.label}</Td>
                <Td>
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">{key.prefix}…</code>
                </Td>
                <Td className="text-slate-500">{formatDate(new Date(key.createdAt))}</Td>
                <Td className="text-slate-500">{key.lastUsedAt ? formatDateTime(new Date(key.lastUsedAt)) : 'Nunca'}</Td>
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
              <Button type="submit" form="generate-key-form" disabled={name.trim() === '' || generate.isBusy}>
                {generate.isBusy ? 'Generando...' : 'Generar'}
              </Button>
            </>
          )
        }
      >
        {generated ? (
          <CopyField value={generated} />
        ) : (
          <form id="generate-key-form" onSubmit={handleGenerate} onChange={generate.clearError} className="space-y-4">
            <FormField label="Nombre" htmlFor="key-label">
              <Input id="key-label" placeholder="Sistema de ventas" value={name} onChange={(event) => setName(event.target.value)} autoFocus />
            </FormField>
            {generate.error && (
              <p role="alert" className="text-sm text-red-600">
                {generate.error}
              </p>
            )}
          </form>
        )}
      </Dialog>

      <ConfirmDialog
        open={revoking !== null}
        onClose={closeRevoke}
        onConfirm={handleRevoke}
        title="¿Revocar esta API key?"
        description={revoke.error ?? `${revoking?.label ?? ''} dejará de funcionar al instante. No se puede deshacer.`}
        confirmLabel="Revocar"
        destructive
      />
    </>
  )
}
