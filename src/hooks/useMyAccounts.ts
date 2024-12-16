import { trpc } from '@/lib/trpc'
import { atom } from 'jotai'
import { Post } from './usePost'

export function useMyAccounts() {
  return trpc.user.accountsByUser.useQuery()
}
