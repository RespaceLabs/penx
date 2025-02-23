import isEqual from 'react-fast-compare'
import { api, trpc } from '@/lib/trpc'
import { Post } from '@/server/db/schema'
import { useQuery } from '@tanstack/react-query'
import { localDB } from '../local-db'
import { queryClient } from '../queryClient'

function equal(remotePages: Post[], localPages: Post[]): boolean {
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
      const remotePages = await api.page.list.query()
      return remotePages as Post[]
    },
  })
}
