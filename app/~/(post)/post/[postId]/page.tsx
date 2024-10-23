'use client'

import { useEffect } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { ImageCreation } from '@/components/Post/ImageCreation'
import { Post } from '@/components/Post/Post'
import { usePost } from '@/hooks/usePost'
import { usePostLoading } from '@/hooks/usePostLoading'
import { PostType } from '@/lib/constants'
import { PostProvider } from './PostProvider'

export const dynamic = 'force-static'

function PostContent() {
  const { post } = usePost()
  const { isPostLoading } = usePostLoading()

  if (isPostLoading || !post)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <LoadingDots />
      </div>
    )

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
