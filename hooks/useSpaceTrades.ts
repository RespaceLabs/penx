import { trpc } from '@/lib/trpc'

export function useSubscriptionRecords(spaceId: string) {
  const { data: records = [], ...rest } =
    trpc.subscriptionRecord.listBySpaceId.useQuery(spaceId)
  return { records, ...rest }
}
