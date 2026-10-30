import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { useRoles } from '@/features/roles'
import { useSystems } from '@/features/systems'
import { useTenants } from '@/features/tenants'
import { useUsers } from '@/features/users'
import { useAssignAccess } from '../hooks/useAssignAccess'
import type { AssignAccessDialogProps } from '../types/access.types'

export function AssignAccessDialog({ open, onClose, onAssigned, userId, systemId }: AssignAccessDialogProps) {
  const users = useUsers().users.filter((user) => user.status === 'active')
  const { systems } = useSystems()
  const allTenants = useTenants().tenants
  const [selectedUser, setSelectedUser] = useState(userId ?? '')
  const [selectedSystem, setSelectedSystem] = useState(systemId ?? '')
  const [selectedTenant, setSelectedTenant] = useState('')
  const [role, setRole] = useState('')
  const [manageUsers, setManageUsers] = useState(false)
  const { assign, isSaving, error, clearError } = useAssignAccess()

  const { roles, isLoading: rolesLoading } = useRoles(selectedSystem)
  const tenants = allTenants.filter((tenant) => tenant.systems.some((system) => system.id === selectedSystem))
  const canSubmit = selectedUser !== '' && selectedSystem !== '' && selectedTenant !== '' && role.trim() !== '' && !isSaving

  const handleSystemChange = (value: string) => {
    setSelectedSystem(value)
    setSelectedTenant('')
    setRole('')
  }

  const handleClose = () => {
    setSelectedUser(userId ?? '')
    setSelectedSystem(systemId ?? '')
    setSelectedTenant('')
    setRole('')
    setManageUsers(false)
    clearError()
    onClose()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    if (await assign({ userId: selectedUser, systemId: selectedSystem, tenantId: selectedTenant, role: role.trim(), manageUsers })) {
      onAssigned()
      handleClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Asignar acceso"
      description="Un usuario puede trabajar para varias empresas en el mismo sistema: asígnale una por vez."
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="assign-access-form" disabled={!canSubmit}>
            {isSaving ? 'Asignando...' : 'Asignar acceso'}
          </Button>
        </>
      }
    >
      <form id="assign-access-form" onSubmit={handleSubmit} className="space-y-4">
        {!userId && (
          <FormField label="Usuario" htmlFor="access-user">
            <Select
              id="access-user"
              value={selectedUser}
              onValueChange={setSelectedUser}
              placeholder="Elige un usuario"
              options={users.map((user) => ({ value: user.id, label: `${user.fullName} · ${user.dni}` }))}
            />
          </FormField>
        )}
        {!systemId && (
          <FormField label="Sistema" htmlFor="access-system">
            <Select
              id="access-system"
              value={selectedSystem}
              onValueChange={handleSystemChange}
              placeholder="Elige un sistema"
              options={systems.map((system) => ({ value: system.id, label: system.name }))}
            />
          </FormField>
        )}
        <FormField label="Empresa" htmlFor="access-tenant" hint="Solo las empresas que contrataron este sistema.">
          <Select
            id="access-tenant"
            value={selectedTenant}
            onValueChange={setSelectedTenant}
            placeholder={selectedSystem ? 'Elige una empresa' : 'Primero elige un sistema'}
            options={tenants.map((tenant) => ({ value: tenant.id, label: tenant.displayName }))}
          />
        </FormField>
        <FormField
          label="Rol"
          htmlFor="access-role"
          hint={
            selectedSystem && !rolesLoading && roles.length === 0
              ? 'Este sistema todavía no tiene roles. Créalos en su detalle, en la pestaña Roles.'
              : 'Los roles se crean en el detalle de cada sistema.'
          }
        >
          <Select
            id="access-role"
            value={role}
            onValueChange={setRole}
            placeholder={!selectedSystem ? 'Primero elige un sistema' : rolesLoading ? 'Cargando roles...' : 'Elige un rol'}
            options={roles.map((item) => ({ value: item.name, label: item.name }))}
          />
        </FormField>
        <Checkbox
          label="Dueño de la empresa en este sistema"
          description="Podrá gestionar a los miembros de su propia empresa."
          checked={manageUsers}
          onChange={(event) => setManageUsers(event.target.checked)}
        />
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  )
}
