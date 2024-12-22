import { trpc } from '@/lib/trpc'

export function useDatabases() {
  return trpc.database.list.useQuery()
}
