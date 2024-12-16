import { trpc } from '@/lib/trpc'
import { atom } from 'jotai'

export function useMyAccounts() {
  return trpc.user.myAccounts.useQuery()
}
