import { useState } from 'react'
import { createUser } from '../services/userService'
import type { CreateUserInput } from '../types/user.types'
import { userErrorMessage } from './userErrors'

export function useCreateUser() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the user was created. */
  const create = async (input: CreateUserInput): Promise<boolean> => {
    setIsSaving(true)
    setError(null)
    try {
      await createUser(input)
      return true
    } catch (caught) {
      setError(userErrorMessage(caught, 'No se pudo crear el usuario. Intenta de nuevo.'))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { create, isSaving, error, clearError: () => setError(null) }
}
