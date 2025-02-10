import { trpc } from '@/lib/trpc'

export function useSiteTags() {
  return trpc.tag.list.useQuery()
}
