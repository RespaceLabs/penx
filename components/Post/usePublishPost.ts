import { useState } from 'react'
import { useAddress } from '@/hooks/useAddress'
import { PostWithSpace } from '@/hooks/usePost'
import { useSpaces } from '@/hooks/useSpaces'
import { addressMap } from '@/lib/address'
import { GateType } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { useWriteContract } from 'wagmi'

export function usePublishPost() {
  const [isLoading, setLoading] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const address = useAddress()
  const { space } = useSpaces()

  return {
    isLoading,
    publishPost: async (post: PostWithSpace, gateType: GateType) => {
      setLoading(true)

      try {
        await api.post.publish.mutate({
          id: post.id,
          gateType,
        })

        setLoading(false)

        revalidateMetadata(`${space.subdomain}-metadata`)
        revalidateMetadata(`${space.subdomain}-posts`)
        revalidateMetadata(`${space.subdomain}-${post.slug}`)
        toast.success('Post published successfully!')
        return

        toast.success('Post published successfully!')
      } catch (error) {
        console.log('========error:', error)
        const msg = extractErrorMessage(error)
        toast.error(msg)
      }

      setLoading(false)
    },
  }
}
