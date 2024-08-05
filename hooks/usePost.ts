'use client'

import { RouterOutputs } from '@/server/_app'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'

export type Post = RouterOutputs['post']['listBySpaceId']['0']

export type PostWithSpace = Post & {
  space: {
    subdomain: string | null
    userId: string
  }
  // user: {
  //   address: string
  //   name: string | null
  // }
}

export const postAtom = atom<PostWithSpace>(null as any as PostWithSpace)

export function usePost() {
  const [post, setPost] = useAtom(postAtom)
  return { post, setPost }
}

export function updatePostPublishStatus() {
  const post = store.get(postAtom)
  store.set(postAtom, { ...post, published: true })
}
