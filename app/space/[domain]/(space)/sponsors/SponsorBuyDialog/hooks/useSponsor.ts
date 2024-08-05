import { trpc } from '@/lib/trpc'

export function useSponsor(spaceId: string) {
  return trpc.sponsor.mySponsorBySpaceId.useQuery({ spaceId })
}
