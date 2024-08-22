import { trpc } from '@/lib/trpc'
import { useSpace } from './useSpace'

export function useTrades() {
  const { space } = useSpace()
  const { data: trades = [], ...rest } = trpc.trade.listBySpaceId.useQuery(
    space.id,
    {
      enabled: !!space?.id,
    },
  )
  return { trades, ...rest }
}
