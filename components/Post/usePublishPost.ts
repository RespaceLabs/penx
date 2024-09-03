import { useState } from 'react'
import { store } from '@/store'
import { useAddress } from '@/hooks/useAddress'
import { PostWithSpace } from '@/hooks/usePost'
import { useSpace } from '@/hooks/useSpace'
import { GateType } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api } from '@/lib/trpc'
import { toast } from 'sonner'
import { postsAtom } from '@/hooks/usePosts'

export function usePublishPost() {
  const [isLoading, setLoading] = useState(false)
  const address = useAddress()
  const { space } = useSpace()

  return {
    isLoading,
    publishPost: async (post: PostWithSpace, gateType: GateType) => {
      setLoading(true)

      try {
        await api.post.publish.mutate({
          id: post.id,
          gateType,
        })

        // update post published 
        if (!post.published) {
          const posts = await api.post.listBySpaceId.query(post.spaceId)
          store.set(postsAtom, posts)
        }

        setLoading(false)

        revalidateMetadata(`${space.subdomain}-metadata`)
        revalidateMetadata(`${space.subdomain}-posts`)
        revalidateMetadata(`${space.subdomain}-${post.slug}`)
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
