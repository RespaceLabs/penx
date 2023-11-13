import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { db } from '@penx/local-db'
import {
  ICellNode,
  IColumnNode,
  INode,
  IRowNode,
  IViewNode,
} from '@penx/model-types'

export interface ILiveQueryContext {
  database: INode
  views: IViewNode[]
  columns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]
}

export const liveQueryContext = createContext<ILiveQueryContext>(
  {} as ILiveQueryContext,
)

export function useLiveQueryContext() {
  return useContext(liveQueryContext)
}

interface LiveQueryProviderProps {
  sql: string
}

export const LiveQueryProvider = ({
  children,
  sql,
}: PropsWithChildren<LiveQueryProviderProps>) => {
  const { Provider } = liveQueryContext
  const [loading, setLoading] = useState(true)
  const [ctx, setCtx] = useState({} as ILiveQueryContext)
  console.log('gogoggo.......')

  const loadLiveQuery = useCallback(async () => {
    console.log('sql:', sql)
    const database = await db.getDatabaseByName('bookmark')
    console.log('==========database:', database)

    // const data = await db.getLiveQuery(databaseId)
    // setLoading(false)
    // setCtx(data as any)
  }, [sql])

  useEffect(() => {
    loadLiveQuery()
  }, [loadLiveQuery])

  if (loading) return null
  return <Provider value={ctx}>{children}</Provider>
}
