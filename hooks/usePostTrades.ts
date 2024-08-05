import { trpc } from '@/lib/trpc'

export function usePostTrades(spaceId: string) {
  const { data: trades = [], ...rest } =
    trpc.trade.listByPostId.useQuery(spaceId)
  return { trades, ...rest }
}
