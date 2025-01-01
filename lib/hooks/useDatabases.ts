import isEqual from 'react-fast-compare'
import { api } from '@/lib/trpc'
import { Database } from '@/server/db/schema'
import { useQuery } from '@tanstack/react-query'
import { localDB } from '../local-db'
import { queryClient } from '../queryClient'

function equal(
  remoteDatabases: Database[],
  localDatabases: Database[],
): boolean {
  if (remoteDatabases.length !== localDatabases.length) return false

  const isSame = remoteDatabases.every((remote, index) => {
    const local = localDatabases[index]
    return isEqual(remote, local)
  })

  return isSame
}

export function useDatabases() {
  return useQuery({
    queryKey: ['databases'],
    queryFn: async () => {
      const databases = await localDB.database.toArray()
      const localDatabases = databases.sort((a, b) => {
        const updatedAtDiff = b.updatedAt.getTime() - a.updatedAt.getTime()
        if (updatedAtDiff === 0) {
          return b.createdAt.getTime() - a.createdAt.getTime()
        }

        return updatedAtDiff
      })

      setTimeout(async () => {
        const remoteDatabases = await api.database.list.query()
        const isEqual = equal(remoteDatabases, localDatabases)

        if (isEqual) return
        await localDB.database.clear()
        await localDB.database.bulkAdd(remoteDatabases as any)
        queryClient.setQueriesData({ queryKey: ['databases'] }, remoteDatabases)
      }, 0)

      return localDatabases as Database[]
    },
  })
}
