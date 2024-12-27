import { trpc } from '@/lib/trpc'

export function usePages() {
  return trpc.page.list.useQuery(undefined, {
    // placeholderData: [],
  })
}
