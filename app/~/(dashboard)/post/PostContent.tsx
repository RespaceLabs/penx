'use client'

import { ImageCreation } from '@/components/Post/ImageCreation'
import { Post } from '@/components/Post/Post'
import { usePost } from '@/lib/hooks/usePost'
import { PostType } from '@/lib/types'

export function PostContent() {
  const { post } = usePost()

  if (post.type === PostType.IMAGE) {
    return <ImageCreation post={post} />
  }

  return <Post post={post} />
}
