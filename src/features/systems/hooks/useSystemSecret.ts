import { useState } from 'react'
import { generateSystemSecret, revokeSystemSecret } from '../services/systemService'
import type { IssuedSecret } from '../types/system.types'

export function useSystemSecret() {
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves to the new credential, or null when it could not be generated. */
  const generate = async (systemId: string): Promise<IssuedSecret | null> => {
    setIsWorking(true)
    setError(null)
    try {
      return await generateSystemSecret(systemId)
    } catch {
      setError('No se pudo generar la credencial. Intenta de nuevo.')
      return null
    } finally {
      setIsWorking(false)
    }
  }

  /** Resolves to true when the credential was revoked. */
  const revoke = async (systemId: string): Promise<boolean> => {
    setIsWorking(true)
    setError(null)
    try {
      await revokeSystemSecret(systemId)
      return true
    } catch {
      setError('No se pudo revocar la credencial. Intenta de nuevo.')
      return false
    } finally {
      setIsWorking(false)
    }
  }

  return { generate, revoke, isWorking, error }
}
