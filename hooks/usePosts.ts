import { trpc } from '@/lib/trpc'
import { atom } from 'jotai'
import { Post } from './usePost'

export function usePosts() {
  return trpc.post.list.useQuery()
}
