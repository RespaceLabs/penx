import { trpc } from '@/lib/trpc'
import { useSpace } from './useSpace'

export function useContributors() {
  const { space } = useSpace()
  const { data: contributors = [], ...rest } =
    trpc.contributor.listBySpaceId.useQuery(space.id, {
      enabled: !!space?.id,
    })
  return { contributors, ...rest }
}
