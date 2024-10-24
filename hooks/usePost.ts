'use client'

import { useEffect } from 'react'
import { PostStatus } from '@/lib/constants'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api, trpc } from '@/lib/trpc'
import { RouterOutputs } from '@/server/_app'
import { store } from '@/store'
import { PostTag, Tag } from '@prisma/client'
import { atom, useAtom } from 'jotai'
import { postLoadingAtom } from './usePostLoading'

export type Post = RouterOutputs['post']['byId']

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

export async function loadPost(postId: string) {
  store.set(postLoadingAtom, true)
  const post = await api.post.byId.query(postId)
  store.set(postAtom, post)
  store.set(postLoadingAtom, false)
}
