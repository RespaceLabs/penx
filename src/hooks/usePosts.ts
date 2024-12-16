import { trpc } from '@/lib/trpc'
import { atom } from 'jotai'

export function usePosts() {
  return trpc.post.list.useQuery()
}
