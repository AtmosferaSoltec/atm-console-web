import { useMemo } from 'react'
import { useAccessBySystem } from '@/features/access'
import { useUsers } from '@/features/users'
import type { OrbitaPeopleSummary, OrbitaPerson } from '../types/orbita.types'
import { useOrbitaSystem } from './useOrbitaSystem'

/** The people with access to Orbita, joined with their user record for the status and the join date. */
export function useOrbitaPeople() {
  const { system, isLoading: systemLoading, error: systemError, reload: reloadSystem } = useOrbitaSystem()
  // With no system yet the id is empty and nothing is requested.
  const access = useAccessBySystem(system?.id ?? '')
  const users = useUsers()

  const people = useMemo<OrbitaPerson[]>(() => {
    const byId = new Map(users.users.map((user) => [user.id, user]))
    return access.items.map((item) => {
      const user = byId.get(item.userId)
      return {
        userId: item.userId,
        name: item.userName || user?.fullName || '',
        email: item.userEmail || user?.email || '',
        status: user?.status ?? null,
        joinedAt: user?.createdAt ?? item.createdAt,
      }
    })
  }, [access.items, users.users])

  const summary = useMemo<OrbitaPeopleSummary>(
    () => ({
      total: people.length,
      active: people.filter((person) => person.status === 'active').length,
      disabled: people.filter((person) => person.status === 'disabled').length,
    }),
    [people],
  )

  const missingSystem = !systemLoading && !systemError && !system ? 'Orbita no está en el catálogo de sistemas.' : null

  return {
    people,
    summary,
    isLoading: systemLoading || access.isLoading || users.isLoading,
    error: systemError ?? missingSystem ?? access.error ?? users.error,
    reload: () => {
      reloadSystem()
      access.reload()
      users.reload()
    },
  }
}
