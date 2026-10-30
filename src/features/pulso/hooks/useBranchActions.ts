import { useState } from 'react'
import { createBranch, deleteBranch, updateBranch } from '../services/pulsoService'
import type { BranchInput } from '../types/pulso.types'
import { pulsoErrorMessage } from './pulsoErrors'

export function useBranchActions() {
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async (action: () => Promise<unknown>, fallback: string): Promise<boolean> => {
    setIsBusy(true)
    setError(null)
    try {
      await action()
      return true
    } catch (caught) {
      setError(pulsoErrorMessage(caught, fallback))
      return false
    } finally {
      setIsBusy(false)
    }
  }

  return {
    isBusy,
    error,
    clearError: () => setError(null),
    create: (gymId: string, input: BranchInput) => run(() => createBranch(gymId, input), 'No se pudo crear la sede. Intenta de nuevo.'),
    update: (branchId: string, input: BranchInput) => run(() => updateBranch(branchId, input), 'No se pudo guardar la sede. Intenta de nuevo.'),
    remove: (branchId: string) => run(() => deleteBranch(branchId), 'No se pudo eliminar la sede. Intenta de nuevo.'),
  }
}
