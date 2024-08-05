import { store } from '@/store'
import { atom, useAtom } from 'jotai'
import { Post } from './usePost'

export const postsAtom = atom<Post[]>([])

export function usePosts() {
  const [posts, setPosts] = useAtom(postsAtom)
  return { posts, setPosts }
}

export function updatePostTitleById(id: string, title: string) {
  const posts = store.get(postsAtom)
  store.set(
    postsAtom,
    posts.map((post) => {
      if (post.id === id) {
        return { ...post, title }
      }
      return post
    }),
  )
}
