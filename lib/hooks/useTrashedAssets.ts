import { trpc } from '@/lib/trpc'
import { RouterOutputs } from '@/server/_app'

export type Asset = RouterOutputs['asset']['list'][0]

export function useTrashedAssets() {
  return trpc.asset.trashedAssets.useQuery({
    pageSize: 10000,
  })
}
