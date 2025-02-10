import isEqual from 'react-fast-compare'
import { api, trpc } from '@/lib/trpc'
import { Page } from '@/server/db/schema'
import { useQuery } from '@tanstack/react-query'
import { localDB } from '../local-db'
import { queryClient } from '../queryClient'

function equal(remotePages: Page[], localPages: Page[]): boolean {
  if (remotePages.length !== localPages.length) return false

  const isSame = remotePages.every((remotePage, index) => {
    const localPage = localPages[index]
    return isEqual(remotePage, localPage)
  })

  return isSame
}

export function usePages() {
  return useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const pages = await localDB.page.toArray()
      const localPages = pages.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
      )

      setTimeout(async () => {
        const remotePages = await api.page.list.query()
        const isEqual = equal(remotePages, localPages as any)
        // console.log('===isEqual:', isEqual)

        if (isEqual) return
        queryClient.setQueriesData({ queryKey: ['pages'] }, remotePages)
        await localDB.page.clear()
        await localDB.page.bulkAdd(remotePages as any)
      }, 0)

      return localPages as Page[]
    },
  })
}
