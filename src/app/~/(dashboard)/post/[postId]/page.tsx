'use client'

import { useEffect } from 'react'
import { ImageCreation } from '@/components/Post/ImageCreation'
import { Post } from '@/components/Post/Post'
import { usePost } from '@/hooks/usePost'
import { PostType } from '@/lib/types'
import { PostProvider } from './PostProvider'

export const runtime = 'edge'
// export const dynamic = 'force-static'

function PostContent() {
  const { post } = usePost()

  if (post.type === PostType.IMAGE) {
    return <ImageCreation post={post} />
  }

  return <Post post={post} />
}

export default function PostPage() {
  return (
    <PostProvider>
      <PostContent />
    </PostProvider>
  )
}
