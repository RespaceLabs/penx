'use client'

import { PropsWithChildren, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { LoadingDots } from '@/components/icons/loading-dots'
import { loadPost, postAtom, usePost } from '@/lib/hooks/usePost'
import { usePostLoading } from '@/lib/hooks/usePostLoading'
import { store } from '@/lib/store'

export function PostProvider({ children }: PropsWithChildren) {
  const params = useSearchParams()
  const id = params?.get('id')
  const { post } = usePost()
  const { isPostLoading } = usePostLoading()

  useEffect(() => {
    if (!id) return

    if (id && store.get(postAtom)?.id !== id) {
      loadPost(id)
    }
  }, [id])

  if (isPostLoading || !post) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return <>{children}</>
}
