'use client'

import { PostStatus } from '@/lib/constants'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { RouterOutputs } from '@/server/_app'
import { store } from '@/store'
import { PostTag, Tag } from '@prisma/client'
import { atom, useAtom } from 'jotai'

export type Post = RouterOutputs['post']['list']['0']

export type PostTagWithTag = PostTag & { tag: Tag }

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

export function addPostTag(postTag: PostTagWithTag) {
  const post = store.get(postAtom)
  store.set(postAtom, {
    ...post,
    postTags: [...post.postTags, postTag as any],
  })
  revalidateMetadata(`posts`)
  revalidateMetadata(`tag-${postTag.tag.name}`)
}

export function removePostTag(postTag: PostTagWithTag) {
  const post = store.get(postAtom)
  const newTags = post.postTags.filter((tag) => tag.id !== postTag.id)
  store.set(postAtom, {
    ...post,
    postTags: newTags,
  })
  revalidateMetadata(`posts`)
  revalidateMetadata(`tag-${postTag.tag.name}`)
}
