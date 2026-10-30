import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyRow } from '@/components/common/EmptyRow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { formatDate } from '@/utils/format'
import { useRemoveAccess } from '../hooks/useRemoveAccess'
import type { AccessItem, AccessTableProps } from '../types/access.types'

export function AccessTable({ items, variant, isLoading, error, onChanged }: AccessTableProps) {
  const [revoking, setRevoking] = useState<AccessItem | null>(null)
  const { remove, isRemoving, error: removeError } = useRemoveAccess()
  const byUser = variant === 'byUser'

  const emptyMessage = isLoading
    ? 'Cargando accesos...'
    : (error ?? (byUser ? 'Este usuario todavía no tiene accesos.' : 'Este sistema todavía no tiene usuarios.'))

  const handleConfirm = async () => {
    if (!revoking) return
    if (await remove(revoking.id)) {
      setRevoking(null)
      onChanged()
    }
  }

  return (
    <>
      <Table>
        <THead>
          <Tr>
            <Th>{byUser ? 'Sistema' : 'Usuario'}</Th>
            <Th>Empresa</Th>
            <Th>Rol</Th>
            <Th>Desde</Th>
            <Th className="w-10" />
          </Tr>
        </THead>
        <TBody>
          {items.length === 0 && <EmptyRow colSpan={5} message={emptyMessage} />}
          {items.map((item) => (
            <Tr key={item.id}>
              <Td>
                {byUser ? (
                  <span className="font-medium text-slate-900">{item.systemName}</span>
                ) : (
                  <>
                    <span className="block font-medium text-slate-900">{item.userName}</span>
                    <span className="block font-mono text-xs text-slate-500">{item.userDni}</span>
                  </>
                )}
              </Td>
              <Td>{item.tenantName}</Td>
              <Td>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone="violet" dot={false} className="font-mono">
                    {item.role}
                  </Badge>
                </div>
              </Td>
              <Td className="text-slate-500">{formatDate(new Date(item.createdAt))}</Td>
              <Td>
                <Button variant="danger-ghost" size="icon" aria-label="Quitar acceso" onClick={() => setRevoking(item)}>
                  <Trash2 className="size-4" />
                </Button>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>

      <ConfirmDialog
        open={revoking !== null}
        onClose={() => setRevoking(null)}
        onConfirm={handleConfirm}
        title="Quitar acceso"
        description={
          revoking
            ? `${revoking.userName || 'El usuario'} dejará de entrar a ${revoking.systemName} en ${revoking.tenantName}.${isRemoving ? ' Quitando...' : ''}${removeError ? ` ${removeError}` : ''}`
            : ''
        }
        confirmLabel="Quitar acceso"
        destructive
      />
    </>
  )
}
