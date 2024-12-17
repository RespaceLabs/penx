'use client'

import { PropsWithChildren, useEffect } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { loadPost, postAtom, usePost } from '@/lib/hooks/usePost'
import { usePostLoading } from '@/lib/hooks/usePostLoading'
import { store } from '@/lib/store'
import { useSearchParams } from 'next/navigation'

export function PostProvider({ children }: PropsWithChildren) {
  const params = useSearchParams()
  const postId = params?.get('id')
  const { post } = usePost()
  const { isPostLoading } = usePostLoading()

  useEffect(() => {
    if (!postId) return

    if (postId && store.get(postAtom)?.id !== postId) {
      loadPost(postId)
    }
  }, [postId])

  if (isPostLoading || !post) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return <>{children}</>
}
