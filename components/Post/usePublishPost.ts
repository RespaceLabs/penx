import { useState } from 'react'
import { useCheckChain } from '@/hooks/useCheckChain'
import { Post } from '@/hooks/usePost'
import { usePosts } from '@/hooks/usePosts'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { creationFactoryAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api } from '@/lib/trpc'
import { GateType } from '@prisma/client'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'
import { useSiteContext } from '../SiteContext'

export function usePublishPost() {
  const { address } = useAccount()
  const { refetch } = usePosts()
  const [isLoading, setLoading] = useState(false)
  const checkChain = useCheckChain()
  const { spaceId } = useSiteContext()
  const { writeContractAsync } = useWriteContract()
  const wagmiConfig = useWagmiConfig()

  return {
    isLoading,
    publishPost: async (
      post: Post,
      gateType: GateType,
      collectable: boolean,
    ) => {
      setLoading(true)

      let creationId: number | undefined
      try {
        if (spaceId && typeof post.creationId !== 'number' && collectable) {
          await checkChain()
          const hash = await writeContractAsync({
            address: addressMap.CreationFactory,
            abi: creationFactoryAbi,
            functionName: 'create',
            args: [post.slug, precision.token(0.0001024), spaceId as Address],
          })

          await waitForTransactionReceipt(wagmiConfig, { hash })

          const creation = await readContract(wagmiConfig, {
            address: addressMap.CreationFactory,
            abi: creationFactoryAbi,
            functionName: 'getUserLatestCreation',
            args: [address!],
          })
          creationId = Number(creation.id)
        }

        await api.post.publish.mutate({
          id: post.id,
          gateType,
          collectable,
          creationId,
        })

        await refetch()

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
