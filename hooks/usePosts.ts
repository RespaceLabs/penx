import { trpc } from '@/lib/trpc'
import { atom } from 'jotai'
import { Post } from './usePost'

export const postsAtom = atom<Post[]>([])

export function usePosts() {
  return trpc.post.list.useQuery()
}
