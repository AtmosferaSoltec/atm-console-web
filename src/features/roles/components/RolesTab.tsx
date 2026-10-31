import { EmptyRow } from '@/components/common/EmptyRow'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import type { RolesTabProps } from '../types/role.types'

/** The roles of a system are fixed in the auth API: here they are only shown. They are given to people from Accesos. */
export function RolesTab({ systemName, roles, isLoading, error }: RolesTabProps) {
  const emptyMessage = isLoading ? 'Cargando roles...' : (error ?? 'Este sistema todavía no tiene roles.')

  return (
    <>
      <CardHeader className="items-center pb-3">
        <div>
          <CardTitle>Roles de {systemName}</CardTitle>
          <CardDescription>
            Los roles son fijos para cada sistema y se asignan a los usuarios desde la pestaña Usuarios. Cada sistema decide qué permite cada uno.
          </CardDescription>
        </div>
      </CardHeader>
      <div className="border-t border-slate-100">
        <Table>
          <THead>
            <Tr>
              <Th>Rol</Th>
              <Th>Descripción</Th>
              <Th className="text-right">Usuarios</Th>
            </Tr>
          </THead>
          <TBody>
            {roles.length === 0 && <EmptyRow colSpan={3} message={emptyMessage} />}
            {roles.map((role) => (
              <Tr key={role.id}>
                <Td className="font-mono font-medium text-slate-900">
                  {role.name}
                  {!role.active && (
                    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 font-sans text-xs font-medium text-amber-800">Rol retirado</span>
                  )}
                </Td>
                <Td>
                  {role.active ? (
                    role.description || <span className="text-slate-400">Sin descripción</span>
                  ) : (
                    <span className="text-amber-700">Ya no existe en el sistema. Quita este rol a sus {role.users} usuarios desde Usuarios.</span>
                  )}
                </Td>
                <Td className="text-right">{role.users}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
    </>
  )
}
