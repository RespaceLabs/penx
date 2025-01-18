import ky from 'ky'
import { Plan, PlanInfo } from '@/app/(creator-fi)/domains/Plan'
import { useSpaceContext } from '@/components/SpaceContext'
import { spaceAbi } from '@/lib/abi'
import { STATIC_URL } from '@/lib/constants'
import { useWagmiConfig } from '@/lib/hooks/useWagmiConfig'
import { isIPFSCID } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { readContracts } from '@wagmi/core'
import { IPFS_GATEWAY } from '../constants'
import { useSpace } from './useSpace'

export function usePlans() {
  const space = useSpaceContext()
  const wagmiConfig = useWagmiConfig()
  const { data: plans = [], ...rest } = useQuery({
    queryKey: ['plans', space.address],
    queryFn: async () => {
      const [token, plansRes] = await readContracts(wagmiConfig, {
        contracts: [
          {
            address: space.address,
            abi: spaceAbi,
            functionName: 'token',
          },
          {
            address: space.address,
            abi: spaceAbi,
            functionName: 'getPlans',
          },
        ],
        allowFailure: false,
      })

      const getPlanInfos = async () => {
        return Promise.all(
          plansRes.map((plan) => {
            if (isIPFSCID(plan.uri)) {
              // return ky.get(`${IPFS_GATEWAY}/ipfs/${plan.uri}`).json<PlanInfo>()
              return { name: '', benefits: '' }
            } else {
              if (!plan.uri) {
                return { name: '', benefits: '' }
              }
              return ky.get(`${STATIC_URL}/${plan.uri}`).json<PlanInfo>()
            }
          }),
        )
      }

      const planInfos = await getPlanInfos()

      const plans: Plan[] = plansRes.map(
        (item, index) =>
          new Plan(
            index,
            { ...item, ...planInfos[index] },
            token[0],
            token[1],
            token[2],
          ),
      )

      return plans
    },
    enabled: !!space.address,
  })

  return { plans, ...rest }
}
