import { useState } from 'react'
import { Post } from '@/hooks/usePost'
import { postsAtom } from '@/hooks/usePosts'
import { GateType, PostStatus } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api } from '@/lib/trpc'
import { store } from '@/store'
import { toast } from 'sonner'

export function usePublishPost() {
  const [isLoading, setLoading] = useState(false)

  return {
    isLoading,
    publishPost: async (post: Post, gateType: GateType) => {
      setLoading(true)

      try {
        await api.post.publish.mutate({
          id: post.id,
          gateType,
        })

        // update post published
        if (post.postStatus === PostStatus.PUBLISHED) {
          const posts = await api.post.list.query()
          store.set(postsAtom, posts)
        }

        setLoading(false)

        revalidateMetadata(`posts`)
        revalidateMetadata(`posts-${post.slug}`)
        toast.success('Post published successfully!')
        return
      } catch (error) {
        console.log('========error:', error)
        const msg = extractErrorMessage(error)
        toast.error(msg)
      }

      setLoading(false)
    },
  }
}
