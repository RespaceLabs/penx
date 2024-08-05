import { trpc } from '@/lib/trpc'

export function useSpaceTrades(spaceId: string) {
  const { data: trades = [], ...rest } =
    trpc.trade.listBySpaceId.useQuery(spaceId)
  return { trades, ...rest }
}
