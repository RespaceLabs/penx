'use client'

import { RouterOutputs } from '@/server/_app'
import { useQuery } from '@tanstack/react-query'
import { api } from '../trpc'

export type Database = RouterOutputs['database']['byId']

export function useQueryDatabase(databaseId: string) {
  return useQuery({
    queryKey: ['database', databaseId],
    queryFn: async () => {
      return await api.database.byId.query(databaseId)
    },
    enabled: !!databaseId,
  })
}
