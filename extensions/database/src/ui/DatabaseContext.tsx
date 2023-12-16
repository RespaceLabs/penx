import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { useDatabase } from '@penx/hooks'
import { db } from '@penx/local-db'
import {
  FieldType,
  ICellNode,
  IColumnNode,
  INode,
  IOptionNode,
  IRowNode,
  IViewNode,
  ViewType,
} from '@penx/model-types'
import { store } from '@penx/store'

export interface IDatabaseContext {
  database: INode
  views: IViewNode[]
  columns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]
  options: IOptionNode[]

  currentView: IViewNode

  viewIndex: number
  setViewIndex: Dispatch<SetStateAction<number>>

  addView(viewType: ViewType): Promise<void>
  addRow(): Promise<void>
  addColumn(fieldType: FieldType): Promise<void>
  deleteColumn(columnId: string): Promise<void>
  moveColumn(fromIndex: number, toIndex: number): Promise<void>
  updateColumnName(columnId: string, name: string): Promise<void>
  addOption(columnId: string, name: string): Promise<IOptionNode>
  deleteCellOption(cellId: string, optionId: string): Promise<void>
  updateView(viewId: string, props: Partial<IViewNode['props']>): Promise<void>
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
    const nodes = await db.listNodesBySpaceId(database.database.spaceId)
    store.node.setNodes(nodes)
  }

  async function addView(viewType: ViewType) {
    await db.addView(databaseId, viewType)
    reloadNodes()
  }

  async function addRow() {
    await db.addRow(databaseId)
    reloadNodes()
  }

  async function addColumn(fieldType: FieldType) {
    await db.addColumn(databaseId, fieldType)
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

  async function addOption(columnId: string, name: string) {
    const newOption = await db.addOption(databaseId, columnId, name)
    reloadNodes()
    return newOption
  }

  async function deleteCellOption(cellId: string, optionId: string) {
    await db.deleteCellOption(cellId, optionId)
    reloadNodes()
  }

  async function updateView(
    viewId: string,
    props: Partial<IViewNode['props']>,
  ) {
    await db.updateView(viewId, props)
    reloadNodes()
  }

  return (
    <Provider
      value={{
        ...database,
        viewIndex,
        currentView: database.views[viewIndex] as IViewNode,
        setViewIndex,
        addView,
        addRow,
        addColumn,
        deleteColumn,
        moveColumn,
        updateColumnName,
        addOption,
        deleteCellOption,
        updateView,
      }}
    >
      {children}
    </Provider>
  )
}

export function useDatabaseContext() {
  return useContext(databaseContext)
}
