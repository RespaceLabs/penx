import { trpc } from '@/lib/trpc'

export function useMembers(spaceId: string) {
  const { data: members = [], ...rest } = trpc.member.listBySpaceId.useQuery(
    spaceId,
    {
      enabled: !!spaceId,
    },
  )
  return { members, ...rest }
}
