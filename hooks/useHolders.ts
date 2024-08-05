import { trpc } from '@/lib/trpc'

export function useHolders(postId = '') {
  const { data: holders = [], ...rest } = trpc.holder.listByPostId.useQuery(
    postId,
    {
      enabled: !!postId,
    },
  )
  return { holders, ...rest }
}
