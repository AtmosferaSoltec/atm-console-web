import { useState } from 'react'
import { deleteRole } from '../services/roleService'
import { roleErrorMessage } from './roleErrors'

export function useDeleteRole() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the role was deleted. */
  const remove = async (systemId: string, roleId: string): Promise<boolean> => {
    setIsDeleting(true)
    setError(null)
    try {
      await deleteRole(systemId, roleId)
      return true
    } catch (caught) {
      setError(roleErrorMessage(caught, 'No se pudo eliminar el rol. Intenta de nuevo.'))
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return { remove, isDeleting, error, clearError: () => setError(null) }
}
