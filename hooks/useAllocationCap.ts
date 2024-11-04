import { tipAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { ALLOCATION_CAP_URL } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'
import { readContract } from '@wagmi/core'
import ky from 'ky'
import { useAccount } from 'wagmi'
import { useWagmiConfig } from './useWagmiConfig'

export function useAllocationCap() {
  const { address } = useAccount()
  const wagmiConfig = useWagmiConfig()

  const { data, ...rest } = useQuery({
    queryKey: ['allocationCap', address!],
    async queryFn() {
      const [allocationCap, tipper] = await Promise.all([
        ky
          .get(ALLOCATION_CAP_URL + `?address=${address}`)
          .json<{ cap: number }>(),
        readContract(wagmiConfig, {
          address: addressMap.Tip,
          abi: tipAbi,
          functionName: 'getTipper',
          args: [address!],
        }),
      ])

      if (Number(tipper.allocatedTime) === 0) {
        return allocationCap.cap
      } else {
        const elapsedTime =
          parseInt((Date.now() / 1000).toFixed(0)) -
          Number(tipper.allocatedTime)
        const releasedAllocation =
          ((elapsedTime * allocationCap.cap) / 60) * 60 * 24

        const newAllocation = Number(tipper.allocation) + releasedAllocation
        return newAllocation > allocationCap.cap
          ? allocationCap.cap
          : newAllocation
      }
    },
    enabled: !!address,
  })

  return { data, ...rest }
}
