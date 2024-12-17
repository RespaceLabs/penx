import { useState } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { useCheckChain } from '@/lib/hooks/useCheckChain'
import { usePost } from '@/lib/hooks/usePost'
import { useWagmiConfig } from '@/lib/hooks/useWagmiConfig'
import { creationFactoryAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { INode, IObjectNode, ObjectType } from '@/lib/model'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { nodeToSlate } from '@/lib/serializer'
import { api } from '@/lib/trpc'
import { GateType, PostType } from '@/lib/types'
import { store } from '@/lib/store'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'

export function usePublishPost() {
  const { spaceId, id } = useSiteContext()
  const { address } = useAccount()
  const [isLoading, setLoading] = useState(false)
  const checkChain = useCheckChain()
  const { writeContractAsync } = useWriteContract()
  const wagmiConfig = useWagmiConfig()
  const { post } = usePost()

  function getImage(node: IObjectNode) {
    if (!node) return ''
    return node.props.objectType === ObjectType.IMAGE
      ? node.props?.imageUrl
      : node.props.coverUrl
  }

  return {
    isLoading,
    publishPost: async (
      node: IObjectNode,
      gateType: GateType,
      collectible: boolean,
    ) => {
      setLoading(true)

      let creationId: number | undefined
      try {
        if (spaceId && typeof post?.creationId !== 'number' && collectible) {
          await checkChain()
          const hash = await writeContractAsync({
            address: addressMap.CreationFactory,
            abi: creationFactoryAbi,
            functionName: 'create',
            args: [
              post?.slug || node?.id,
              precision.token(0.0001024),
              spaceId as Address,
            ],
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
          postId: post?.id,
          gateType,
          collectible,
          creationId,
        })

        setLoading(false)
        revalidateMetadata(`posts`)
        // revalidateMetadata(`posts-${post.slug}`)
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
