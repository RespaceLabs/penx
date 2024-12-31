import isEqual from 'react-fast-compare'
import { api } from '@/lib/trpc'
import { RouterOutputs } from '@/server/_app'
import { useQuery } from '@tanstack/react-query'
import { localDB } from '../local-db'
import { queryClient } from '../queryClient'

export type Asset = RouterOutputs['asset']['list'][0]

function equal(remoteAssets: Asset[], localAssets: Asset[]): boolean {
  if (remoteAssets.length !== localAssets.length) return false

  const isSame = remoteAssets.every((remote, index) => {
    const local = localAssets[index]
    return isEqual(remote, local)
  })

  return isSame
}

export function useAssets() {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const assets = await localDB.asset.toArray()
      const localAssets = assets.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
      )

      setTimeout(async () => {
        const remoteAssets = await api.asset.list.query({
          pageSize: 100000,
        })

        const isEqual = equal(remoteAssets, localAssets)

        if (isEqual) return
        queryClient.setQueriesData({ queryKey: ['assets'] }, remoteAssets)
        await localDB.asset.clear()
        await localDB.asset.bulkAdd(remoteAssets as any)
      }, 0)

      return localAssets as Asset[]
    },
  })
}
