import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyRow } from '@/components/common/EmptyRow'
import { Button } from '@/components/ui/button'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { useDeleteRole } from '../hooks/useDeleteRole'
import type { RoleItem, RolesTabProps } from '../types/role.types'
import { CreateRoleDialog } from './CreateRoleDialog'

export function RolesTab({ systemId, systemName, roles, isLoading, error, onChanged }: RolesTabProps) {
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<RoleItem | null>(null)
  const { remove, isDeleting, error: deleteError, clearError } = useDeleteRole()

  const emptyMessage = isLoading ? 'Cargando roles...' : (error ?? 'Este sistema todavía no tiene roles.')

  const closeDelete = () => {
    setDeleting(null)
    clearError()
  }

  const handleDelete = async () => {
    if (!deleting) return
    if (await remove(systemId, deleting.id)) {
      closeDelete()
      onChanged()
    }
  }

  return (
    <>
      <CardHeader className="items-center pb-3">
        <div>
          <CardTitle>Roles de {systemName}</CardTitle>
          <CardDescription>Los roles que se pueden dar a sus usuarios. Cada sistema decide qué permite cada uno.</CardDescription>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" />
          Nuevo rol
        </Button>
      </CardHeader>
      <div className="border-t border-slate-100">
        <Table>
          <THead>
            <Tr>
              <Th>Rol</Th>
              <Th>Descripción</Th>
              <Th className="text-right">Usuarios</Th>
              <Th className="w-10" />
            </Tr>
          </THead>
          <TBody>
            {roles.length === 0 && <EmptyRow colSpan={4} message={emptyMessage} />}
            {roles.map((role) => (
              <Tr key={role.id}>
                <Td className="font-mono font-medium text-slate-900">{role.name}</Td>
                <Td>{role.description || <span className="text-slate-400">Sin descripción</span>}</Td>
                <Td className="text-right">{role.users}</Td>
                <Td>
                  <Button
                    variant="danger-ghost"
                    size="icon"
                    aria-label={`Eliminar el rol ${role.name}`}
                    title={role.users > 0 ? 'Tiene usuarios: cámbiales el rol primero' : 'Eliminar rol'}
                    disabled={role.users > 0}
                    onClick={() => setDeleting(role)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>

      <CreateRoleDialog systemId={systemId} open={creating} onClose={() => setCreating(false)} onCreated={onChanged} />
      <ConfirmDialog
        open={deleting !== null}
        onClose={closeDelete}
        onConfirm={handleDelete}
        title="Eliminar rol"
        description={
          deleting
            ? `Se eliminará el rol ${deleting.name} de ${systemName}.${isDeleting ? ' Eliminando...' : ''}${deleteError ? ` ${deleteError}` : ''}`
            : ''
        }
        confirmLabel="Eliminar rol"
        destructive
      />
    </>
  )
}
