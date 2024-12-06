'use client'

import { PropsWithChildren, useEffect } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { loadPost, postAtom, usePost } from '@/hooks/usePost'
import { usePostLoading } from '@/hooks/usePostLoading'
import { store } from '@/store'
import { useParams } from 'next/navigation'

export function PostProvider({ children }: PropsWithChildren) {
  const params = useParams() as Record<string, string>
  const { post } = usePost()
  const { isPostLoading } = usePostLoading()

  useEffect(() => {
    if (!params?.postId) return

    if (params?.postId && store.get(postAtom)?.id !== params?.postId) {
      loadPost(params?.postId)
    }
  }, [params?.postId])

  if (isPostLoading || !post) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return <>{children}</>
}
