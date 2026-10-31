import { useState } from 'react'
import { addMember, createBranch, createGroup, createGym, deleteBranch, deleteGroup, moveGym, removeMember, renameGroup, updateBranch, updateGymColor, updateGymFeatures } from '../services/pulsoService'
import type { BranchInput, NewGymInput, NewMemberInput } from '../types/pulso.types'
import { pulsoErrorMessage } from './pulsoErrors'

/** Every change the Pulso section can make; each resolves to true when it worked and keeps the Spanish error otherwise. */
export function usePulsoActions() {
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
    saveGroup: (name: string, groupId?: string) =>
      run(() => (groupId ? renameGroup(groupId, name) : createGroup(name)), 'No se pudo guardar el grupo. Intenta de nuevo.'),
    removeGroup: (groupId: string) => run(() => deleteGroup(groupId), 'No se pudo eliminar el grupo. Intenta de nuevo.'),
    moveGym: (gymId: string, groupId: string) => run(() => moveGym(gymId, groupId), 'No se pudo mover el gimnasio. Intenta de nuevo.'),
    createGym: (input: NewGymInput) => run(() => createGym(input), 'No se pudo crear el gimnasio. Intenta de nuevo.'),
    setColor: (gymId: string, color: string) => run(() => updateGymColor(gymId, color), 'No se pudo guardar el color. Intenta de nuevo.'),
    setFeatures: (gymId: string, features: string[]) => run(() => updateGymFeatures(gymId, features), 'No se pudieron guardar los módulos. Intenta de nuevo.'),
    addMember: (input: NewMemberInput) => run(() => addMember(input), 'No se pudo agregar a la persona. Intenta de nuevo.'),
    removeMember: (accessId: string) => run(() => removeMember(accessId), 'No se pudo quitar el acceso. Intenta de nuevo.'),
  }
}
