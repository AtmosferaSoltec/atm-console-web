import { useState } from 'react'
import { createRole } from '../services/roleService'
import type { CreateRoleInput } from '../types/role.types'
import { roleErrorMessage } from './roleErrors'

export function useCreateRole() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the role was created. */
  const create = async (systemId: string, input: CreateRoleInput): Promise<boolean> => {
    setIsSaving(true)
    setError(null)
    try {
      await createRole(systemId, input)
      return true
    } catch (caught) {
      setError(roleErrorMessage(caught, 'No se pudo crear el rol. Intenta de nuevo.'))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { create, isSaving, error, clearError: () => setError(null) }
}
