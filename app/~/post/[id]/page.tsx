'use client'

import LoadingDots from '@/components/icons/loading-dots'
import { Post } from '@/components/Post/Post'
import { usePost } from '@/hooks/usePost'
import { usePostLoading } from '@/hooks/usePostLoading'

export default function PostPage() {
  const { post } = usePost()
  const { isPostLoading } = usePostLoading()

  if (isPostLoading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <LoadingDots />
      </div>
    )

  if (!post) return null
  return <Post post={post} isPostLoading={isPostLoading} />
}
