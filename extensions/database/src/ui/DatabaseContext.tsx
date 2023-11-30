import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useDatabase } from '@penx/hooks'
import { db } from '@penx/local-db'
import {
  FieldType,
  ICellNode,
  IColumnNode,
  INode,
  IRowNode,
  IViewNode,
} from '@penx/model-types'
import { store } from '@penx/store'

export interface IDatabaseContext {
  database: INode
  views: IViewNode[]
  columns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]

  currentView: IViewNode

  viewIndex: number
  setViewIndex: Dispatch<SetStateAction<number>>
  addRow(): Promise<void>
  addColumn(fieldType: FieldType): Promise<void>
  deleteColumn(columnId: string): Promise<void>
  moveColumn(fromIndex: number, toIndex: number): Promise<void>
  updateColumnName(columnId: string, name: string): Promise<void>
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
  const [viewIndex, setViewIndex] = useState(0)
  const database = useDatabase(databaseId)

  async function reloadNodes() {
    const nodes = await db.listNodesBySpaceId(database.database.id)
    store.node.setNodes(nodes)
  }

  async function addColumn(fieldType: FieldType) {
    await db.addColumn(databaseId, fieldType)
    reloadNodes()
  }

  async function addRow() {
    await db.addRow(databaseId)
    reloadNodes()
  }

  async function deleteColumn(columnId: string) {
    await db.deleteColumn(databaseId, columnId)
    reloadNodes()
  }

  async function moveColumn(fromIndex: number, toIndex: number) {
    const view = database.views[viewIndex]
    await db.moveColumn(databaseId, view.id, fromIndex, toIndex)
    reloadNodes()
  }

  async function updateColumnName(columnId: string, name: string) {
    await db.updateColumnName(columnId, name)
    reloadNodes()
  }

  return (
    <Provider
      value={{
        ...database,
        viewIndex,
        currentView: database.views[viewIndex] as IViewNode,
        setViewIndex,
        addRow,
        addColumn,
        deleteColumn,
        moveColumn,
        updateColumnName,
      }}
    >
      {children}
    </Provider>
  )
}

export function useDatabaseContext() {
  return useContext(databaseContext)
}
