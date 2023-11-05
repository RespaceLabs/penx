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
  FieldType,
  ICellNode,
  IColumnNode,
  INode,
  IRowNode,
  IViewNode,
} from '@penx/types'

export interface IDatabaseContext {
  database: INode
  views: IViewNode[]
  columns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]

  addColumn(fieldType: FieldType): Promise<void>
  addRow(): Promise<void>
}

export const databaseContext = createContext<IDatabaseContext>(
  {} as IDatabaseContext,
)

interface DatabaseProviderProps {
  databaseId: string
}

export const DatabaseProvider = ({
  children,
  databaseId,
}: PropsWithChildren<DatabaseProviderProps>) => {
  const { Provider } = databaseContext
  const [loading, setLoading] = useState(true)
  const [ctx, setCtx] = useState({} as IDatabaseContext)

  const loadDatabase = useCallback(async () => {
    const data = await db.getDatabase(databaseId)
    setLoading(false)
    setCtx(data as any)
  }, [databaseId])

  async function addColumn(fieldType: FieldType) {
    await db.addColumn(databaseId, fieldType)
    loadDatabase()
  }

  async function addRow() {
    await db.addRow(databaseId)
    loadDatabase()
  }

  ctx.addColumn = addColumn
  ctx.addRow = addRow

  useEffect(() => {
    loadDatabase()
  }, [loadDatabase])

  if (loading) return null
  return <Provider value={ctx}>{children}</Provider>
}

export function useDatabaseContext() {
  return useContext(databaseContext)
}
