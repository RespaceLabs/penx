import { trpc } from '@/lib/trpc'
import { useSpace } from './useSpace'

export function useThemes() {
  const { space } = useSpace()
  const { data: themes = [], ...rest } = trpc.theme.listBySpaceId.useQuery(
    space.id,
    {
      enabled: !!space?.id,
    },
  )
  return { themes, ...rest }
}
