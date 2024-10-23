'use client'

import { PropsWithChildren } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { usePost, useQueryPost } from '@/hooks/usePost'
import { useParams } from 'next/navigation'

export function PostProvider({ children }: PropsWithChildren) {
  const params = useParams() as Record<string, string>
  const { post } = usePost()

  const { isLoading } = useQueryPost(params?.postId)

  if (isLoading || !post) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <LoadingDots />
      </div>
    )
  }

  return <>{children}</>
}
