import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { db } from '@penx/local-db'
import {
  FieldType,
  Filter,
  Group,
  ICellNode,
  IColumnNode,
  IDatabaseNode,
  IFilterResult,
  INode,
  IOptionNode,
  IRowNode,
  IViewNode,
  Sort,
  ViewColumn,
  ViewType,
} from '@penx/model-types'
import { useDatabase } from '@penx/node-hooks'
import { store } from '@penx/store'
import { TableSearch } from '@penx/table-search'

export interface IDatabaseContext {
  database: IDatabaseNode
  views: IViewNode[]
  columns: IColumnNode[]
  sortedColumns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]
  options: IOptionNode[]
  currentView: IViewNode

  filterResult: IFilterResult
  updateRowsIndexes: () => void

  activeViewId: string
  setActiveViewId: Dispatch<SetStateAction<string>>

  updateDatabaseProps: (props: Partial<IDatabaseNode['props']>) => void

  addView(viewType: ViewType): Promise<IViewNode>
  updateView(viewId: string, props: Partial<IViewNode['props']>): Promise<void>
  deleteView(viewId: string): Promise<void>

  updateViewColumn(
    viewId: string,
    columnId: string,
    props: Partial<ViewColumn>,
  ): Promise<void>

  addRow(): Promise<void>
  deleteRow(rowId: string): Promise<void>

  addColumn(fieldType: FieldType): Promise<void>
  deleteColumn(columnId: string): Promise<void>
  moveColumn(fromIndex: number, toIndex: number): Promise<void>

  addSort(viewId: string, columnId: string, props: Partial<Sort>): Promise<void>
  deleteSort(viewId: string, columnId: string): Promise<void>

  addGroup(
    viewId: string,
    columnId: string,
    props: Partial<Group>,
  ): Promise<void>
  deleteGroup(viewId: string, columnId: string): Promise<void>

  addFilter(
    viewId: string,
    columnId: string,
    props: Partial<Filter>,
  ): Promise<void>
  deleteFilter(viewId: string, columnId: string): Promise<void>
  applyFilter(viewId: string, filters: Filter[]): Promise<void>

  updateFilter(
    viewId: string,
    columnId: string,
    newColumnId: string,
    props?: Partial<Filter>,
  ): Promise<void>

  updateColumnName(columnId: string, name: string): Promise<void>
  updateColumnWidth(columnId: string, width: number): Promise<void>
  addOption(columnId: string, name: string): Promise<IOptionNode>
  deleteCellOption(cellId: string, optionId: string): Promise<void>
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
  const database = useDatabase(databaseId)

  const [activeViewId, setActiveViewId] = useState(() => {
    const view = database.views.find(
      (v) => v.id === database.database.props.activeViewId,
    )
    return view?.id || database?.views[0]?.id
  })

  async function reloadNodes() {
    const nodes = await db.listNodesBySpaceId(database.database.spaceId)
    store.node.setNodes(nodes)
  }

  async function updateDatabaseProps(props: Partial<IDatabaseNode['props']>) {
    await db.updateNode(databaseId, {
      props: {
        ...database.database.props,
        ...props,
      },
    })
    reloadNodes()
  }

  async function addView(viewType: ViewType) {
    const view = await db.addView(databaseId, viewType)
    reloadNodes()
    return view
  }

  async function updateView(
    viewId: string,
    props: Partial<IViewNode['props']>,
  ) {
    await db.updateView(viewId, props)
    reloadNodes()
  }

  async function deleteView(viewId: string) {
    await db.deleteView(databaseId, viewId)
    reloadNodes()
  }

  async function updateViewColumn(
    viewId: string,
    columnId: string,
    props: Partial<ViewColumn>,
  ) {
    await db.updateViewColumn(viewId, columnId, props)
    reloadNodes()
  }

  async function addRow() {
    await db.addRow({ databaseId })
    reloadNodes()
  }

  async function deleteRow(rowId: string) {
    await db.deleteRow(databaseId, rowId)
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
    const view = database.views.find((v) => v.id === activeViewId)!
    await db.moveColumn(databaseId, view.id, fromIndex, toIndex)
    reloadNodes()
  }

  async function updateColumnName(columnId: string, name: string) {
    await db.updateColumnName(columnId, name)
    reloadNodes()
  }

  async function updateColumnWidth(columnId: string, width: number) {
    await db.updateColumnWidth(currentView.id, columnId, width)
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

  async function addSort(
    viewId: string,
    columnId: string,
    props: Partial<Sort>,
  ) {
    await db.addSort(viewId, columnId, props)
    reloadNodes()
  }

  async function deleteSort(viewId: string, columnId: string) {
    await db.deleteSort(viewId, columnId)
    reloadNodes()
  }

  async function addGroup(
    viewId: string,
    columnId: string,
    props: Partial<Group>,
  ) {
    await db.addGroup(viewId, columnId, props)
    reloadNodes()
  }

  async function deleteGroup(viewId: string, columnId: string) {
    await db.deleteGroup(viewId, columnId)
    reloadNodes()
  }

  async function addFilter(
    viewId: string,
    columnId: string,
    props: Partial<Filter>,
  ) {
    await db.addFilter(viewId, columnId, props)
    reloadNodes()
  }

  async function deleteFilter(viewId: string, columnId: string) {
    await db.deleteFilter(viewId, columnId)
    reloadNodes()
  }

  async function applyFilter(viewId: string, filters: Filter[]) {
    await db.applyFilter(viewId, filters)
    reloadNodes()
  }

  async function updateFilter(
    viewId: string,
    columnId: string,
    newColumnId: string,
    props?: Partial<Filter>,
  ) {
    await db.updateFilter(viewId, columnId, newColumnId, props)
    reloadNodes()
  }

  const currentView = useMemo(() => {
    return database.views.find((view) => view.id === activeViewId)!
  }, [database, activeViewId])

  const sortedColumns = useMemo(() => {
    if (!currentView) return []
    let { viewColumns = [] } = currentView.props
    return viewColumns
      .map(({ columnId }) => {
        return database.columns.find((col) => col.id === columnId)!
      })
      .filter((col) => !!col)
  }, [currentView, database.columns])

  const updateRowsIndexes = useCallback(() => {
    const { rows, columns } = database
    const dataSource: INode[] = []
    const cells = store.node.getCells(databaseId)

    rows.forEach((row) => {
      columns.forEach((col) => {
        const cell = cells.find(
          (c) => c.props.columnId === col.id && c.props.rowId === row.id,
        )
        if (cell) {
          dataSource.push(cell)
        }
      })
    })

    TableSearch.initTableSearch(dataSource, databaseId, true)
  }, [database, databaseId])

  const generateFilter = (databaseId: string): IFilterResult => {
    let dataSource: INode[] = []
    const { rows, columns, cells } = database

    // TODO: why currentView is null?
    const { filters = [] } = currentView?.props || {}

    const initializedData = rows.map((row) => {
      return columns.reduce(
        (acc, col) => {
          // need to improvement performance
          const cell = cells.find(
            (c) => c.props.columnId === col.id && c.props.rowId === row.id,
          )!

          if (cell) {
            dataSource.push(cell)
          }

          return { ...acc, [col.id]: cell }
        },
        {} as Record<string, ICellNode>,
      )
    })

    if (!filters.length) {
      return { cellNodesMapList: initializedData, filterRows: rows }
    }

    const tableSearch = TableSearch.initTableSearch(dataSource, databaseId)
    const filterRows: IRowNode[] = []

    const { rowKeys } = tableSearch.search(filters, databaseId)
    const cellNodesMapList = rows.reduce(
      (acc: Record<string, ICellNode>[], row) => {
        if (rowKeys.includes(row.id)) {
          filterRows.push(row)

          const rowData = columns.reduce(
            (rowData, col) => {
              const cell = cells.find(
                (c) => c.props.columnId === col.id && c.props.rowId === row.id,
              )!

              rowData[col.id] = cell
              return rowData
            },
            {} as Record<string, ICellNode>,
          )

          acc.push(rowData)
        }

        return acc
      },
      [],
    )

    return { cellNodesMapList, filterRows }
  }

  return (
    <Provider
      value={{
        ...database,
        filterResult: generateFilter(databaseId),
        updateRowsIndexes,

        currentView,
        sortedColumns,

        activeViewId,
        setActiveViewId,

        updateDatabaseProps,

        addView,
        deleteView,
        updateView,

        updateViewColumn,

        addRow,
        deleteRow,

        addColumn,
        deleteColumn,
        moveColumn,
        updateColumnName,
        updateColumnWidth,
        addOption,
        deleteCellOption,

        addSort,
        deleteSort,

        addGroup,
        deleteGroup,

        addFilter,
        deleteFilter,
        applyFilter,
        updateFilter,
      }}
    >
      {children}
    </Provider>
  )
}

export function useDatabaseContext() {
  return useContext(databaseContext)
}
