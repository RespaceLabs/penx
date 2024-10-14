'use client'

import { PostStatus } from '@/lib/constants'
import { RouterOutputs } from '@/server/_app'
import { store } from '@/store'
import { PostTag } from '@prisma/client'
import { atom, useAtom } from 'jotai'

export type Post = RouterOutputs['post']['list']['0']

export const postAtom = atom<Post>(null as any as Post)

export function usePost() {
  const [post, setPost] = useAtom(postAtom)
  return { post, setPost }
}

export function updatePostPublishStatus() {
  const post = store.get(postAtom)
  store.set(postAtom, {
    ...post,
    postStatus: PostStatus.PUBLISHED,
    publishedAt: new Date(),
  })
}

export function addPostTag(postTag: any) {
  const post = store.get(postAtom)
  store.set(postAtom, {
    ...post,
    postTags: [...post.postTags, postTag],
  })
}

export function removePostTag(id: string) {
  const post = store.get(postAtom)
  const newTags = post.postTags.filter((tag) => tag.id !== id)
  store.set(postAtom, {
    ...post,
    postTags: newTags,
  })
}
