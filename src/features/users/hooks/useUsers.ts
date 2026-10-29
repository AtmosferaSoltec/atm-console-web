import { useApiQuery } from '@/hooks/useApiQuery'
import { listUsers } from '../services/userService'
import type { UserItem } from '../types/user.types'

interface UsersResult {
  users: UserItem[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

export function useUsers(): UsersResult {
  const { data, isLoading, error, reload } = useApiQuery(listUsers)
  return { users: data ?? [], isLoading, error, reload }
}

/** The API has no single-user endpoint, so the user is picked from the list. */
export function useUser(userId: string | undefined) {
  const { users, isLoading, error, reload } = useUsers()
  return { user: users.find((item) => item.id === userId), isLoading, error, reload }
}
