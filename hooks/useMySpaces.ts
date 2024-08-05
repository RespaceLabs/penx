import { trpc } from '@/lib/trpc'

export function useMySpaces() {
  return trpc.space.mySpaces.useQuery()
}
