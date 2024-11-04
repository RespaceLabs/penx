import { useDatabase } from '@/lib/node-hooks'
import { DatabaseInfo } from './types'

interface Props {
  databaseId: string
  children: (props: DatabaseInfo) => React.ReactNode
}

export function WithStoreDatabase({ databaseId, children }: Props) {
  const database = useDatabase(databaseId)
  return <>{children(database)}</>
}
