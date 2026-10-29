import { useState } from 'react'
import { ApiError } from '@/services/httpClient'
import { adminLogin } from '../services/authService'
import type { LoginFormValues } from '../types/auth.types'

function loginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'invalid_credentials') return 'Usuario o contraseña incorrectos.'
    if (error.code === 'too_many_attempts') {
      const minutes = Math.ceil((error.retryAfterSeconds ?? 60) / 60)
      return `Demasiados intentos. Intenta de nuevo en ${minutes} min.`
    }
    return 'No se pudo iniciar sesión. Intenta de nuevo.'
  }
  return 'No se pudo conectar con el servidor.'
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the session was created. */
  const login = async (values: LoginFormValues): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await adminLogin(values)
      return true
    } catch (caught) {
      setError(loginErrorMessage(caught))
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
