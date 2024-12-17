import { tipAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { ALLOCATION_CAP_URL } from '@/lib/constants'
import { precision } from '@/lib/math'
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
        return { cap: allocationCap.cap, dayCap: allocationCap.cap }
      } else {
        const elapsedTime =
          parseInt((Date.now() / 1000).toFixed(0)) -
          Number(tipper.allocatedTime)

        const releasedAllocation =
          (elapsedTime * allocationCap.cap) / (60 * 60 * 24)

        const newAllocation =
          Number(precision.toDecimal(tipper.allocation)) + releasedAllocation

        const cap =
          newAllocation > allocationCap.cap ? allocationCap.cap : newAllocation

        return { cap, dayCap: allocationCap.cap }
      }
    },
    enabled: !!address,
  })

  return { data, ...rest }
}
