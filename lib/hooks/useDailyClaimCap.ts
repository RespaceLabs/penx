import { DAILY_CLAIM_CAP_URL } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useAccount } from 'wagmi'

export function useDailyClaimCap() {
  const { address } = useAccount()

  const { data, ...rest } = useQuery({
    queryKey: ['DailyClaimCap', address!],
    async queryFn() {
      return ky
        .get(DAILY_CLAIM_CAP_URL + `?address=${address}`)
        .json<{ cap: number }>()
    },
    enabled: !!address,
  })

  return { data, ...rest }
}
