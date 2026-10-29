import { useState } from 'react'
import { resetUserPassword, setUserStatus } from '../services/userService'
import { userErrorMessage } from './userErrors'

export function useUserActions() {
  const [isWorking, setIsWorking] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to true when the action went through. */
  const run = async (action: () => Promise<void>, success: string): Promise<boolean> => {
    setIsWorking(true)
    setNotice(null)
    setError(null)
    try {
      await action()
      setNotice(success)
      return true
    } catch (caught) {
      setError(userErrorMessage(caught, 'No se pudo completar la acción. Intenta de nuevo.'))
      return false
    } finally {
      setIsWorking(false)
    }
  }

  return {
    isWorking,
    notice,
    error,
    resetPassword: (userId: string) =>
      run(() => resetUserPassword(userId), 'Contraseña restablecida. Ahora es su DNI y deberá cambiarla al ingresar.'),
    setStatus: (userId: string, status: 'active' | 'disabled') =>
      run(() => setUserStatus(userId, status), status === 'disabled' ? 'Cuenta desactivada. Se cerraron sus sesiones.' : 'Cuenta activada.'),
  }
}
