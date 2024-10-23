'use client'

import { useEffect } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { ImageCreation } from '@/components/Post/ImageCreation'
import { Post } from '@/components/Post/Post'
import { usePost } from '@/hooks/usePost'
import { usePostLoading } from '@/hooks/usePostLoading'
import { PostType } from '@/lib/constants'

export const dynamic = 'force-static'

export default function PostPage() {
  const { post } = usePost()
  const { isPostLoading } = usePostLoading()

  if (isPostLoading || !post)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <LoadingDots />
      </div>
    )

  if (post.type === PostType.IMAGE) {
    return <ImageCreation post={post} isPostLoading={isPostLoading} />
  }

  return <Post post={post} isPostLoading={isPostLoading} />
}
