import { useState } from 'react'
import { useAddress } from '@/hooks/useAddress'
import { updateSpaceById, useSpaces } from '@/hooks/useSpaces'
import { indieXAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi'
import { CurveService } from '@/services/CurveService'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { useWriteContract } from 'wagmi'

export function useEnableSponsor() {
  const [isLoading, setLoading] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const { space } = useSpaces()
  const address = useAddress()
  return {
    isLoading,
    enable: async (spaceId: string) => {
      setLoading(true)
      try {
        const curveService = new CurveService()
        const sponsorCurve = curveService.getNumberFormat('PromotionSponsor')
        const hash = await writeContractAsync({
          address: addressMap.IndieX,
          abi: indieXAbi,
          functionName: 'newCreation',
          args: [
            {
              name: `PenX space ${spaceId} sponsor`,
              uri: spaceId,
              appId: BigInt(1),
              curatorFeePercent: precision.token(30, 16),
              isFarming: false,
              curve: sponsorCurve,
              farmer: 0,
              curveArgs: [],
            },
          ],
        })

        await waitForTransactionReceipt(wagmiConfig, { hash })
        const creation = await readContract(wagmiConfig, {
          address: addressMap.IndieX,
          abi: indieXAbi,
          functionName: 'getUserLatestCreation',
          args: [address!],
        })

        await api.space.enableSponsor.mutate({
          id: spaceId,
          creationId: creation.id.toString(),
        })

        updateSpaceById(spaceId, {
          sponsorCreationId: creation.id.toString(),
        })
        revalidateMetadata(`${space.subdomain}-metadata`)

        toast.success('Enable sponsor feature successfully!')
      } catch (error) {
        console.log('========error:', error)
        const msg = extractErrorMessage(error)
        toast.error(msg)
      }

      setLoading(false)
    },
  }
}
