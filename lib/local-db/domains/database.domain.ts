import { FILE_DATABASE_NAME, TODO_DATABASE_NAME } from '@/lib/constants'
import {
  ConjunctionType,
  FieldType,
  Filter,
  Group,
  ICellNode,
  ICellNodeProps,
  IColumnNode,
  IDatabaseNode,
  INode,
  IOptionNode,
  IRowNode,
  IViewNode,
  NodeType,
  Sort,
  ViewColumn,
  ViewType,
} from '@/lib/model'
import { uniqueId } from '@/lib/unique-id'
import { arrayMoveImmutable } from 'array-move'
import { formatTagName } from '../libs/formatTagName'
import { getRandomColor } from '../libs/getRandomColor'
import { PenxDB, penxDB } from '../penx-db'
import {
  AddRowByFieldNameOptions,
  AddRowOptions,
  ColumnSchema,
  createDatabaseOptions,
  CreateFileRowOptions,
} from '../types'
import { NodeDomain, nodeDomain } from './node.domain'

export class DatabaseDomain {
  constructor(
    private penx: PenxDB,
    private node: NodeDomain,
  ) {}

  getDatabaseRootNode = async (userId: string) => {
    const node = await this.penx.node
      .where({
        type: NodeType.DATABASE_ROOT,
        userId,
      })
      .first()
    return node as IDatabaseNode
  }

  listDatabases = async () => {
    const nodes = (await this.penx.node
      .where({ type: NodeType.DATABASE })
      .toArray()) as IDatabaseNode[]

    return nodes
  }

  listDatabaseBySpace = async (userId: string) => {
    const nodes = (await this.penx.node
      .where({
        type: NodeType.DATABASE,
        userId,
      })
      .toArray()) as IDatabaseNode[]

    return nodes
  }

  createDatabase = async ({
    userId = window.__USER_ID__,
    name,
    columnSchema = [],
    shouldInitCells = false,
  }: createDatabaseOptions) => {
    const databaseByName = await this.getDatabaseByName(userId, name)

    if (databaseByName) return databaseByName as IDatabaseNode

    const databaseRootNode = await this.getDatabaseRootNode(userId)

    const database = await this.node.createNode<IDatabaseNode>({
      parentId: databaseRootNode.id,
      userId,
      type: NodeType.DATABASE,
      props: {
        color: getRandomColor(),
        name,
        activeViewId: '',
        viewIds: [],
      },
    })

    await this.node.updateNode(databaseRootNode.id, {
      children: [...(databaseRootNode.children || []), database.id],
    })

    const columns = await this.initColumns(
      userId,
      database.id,
      name,
      columnSchema,
    )

    const viewColumns: ViewColumn[] = columns.map((column) => ({
      columnId: column.id,
      width: 160,
      visible: true,
    }))

    // init table view
    const tableView = await this.node.createNode<IViewNode>({
      userId,
      databaseId: database.id,
      parentId: database.id,
      type: NodeType.VIEW,
      children: columns.map((column) => column.id),
      props: {
        name: 'Table',
        viewType: ViewType.TABLE,
        viewColumns,
        sorts: [],
        filters: [],
        groups: [],
        kanbanColumnId: '',
        kanbanOptionIds: [],
      },
    })

    // init list view
    const listView = await this.node.createNode<IViewNode>({
      userId,
      databaseId: database.id,
      parentId: database.id,
      type: NodeType.VIEW,
      children: columns.map((column) => column.id),
      props: {
        name: 'List',
        viewType: ViewType.LIST,
        viewColumns,
        sorts: [],
        filters: [],
        groups: [],
        kanbanColumnId: '',
        kanbanOptionIds: [],
      },
    })

    await this.node.updateNode(database.id, {
      props: {
        ...database.props,
        activeViewId: tableView.id,
        viewIds: [tableView.id, listView.id],
      },
    })

    if (shouldInitCells) {
      const rows = await this.initRows(userId, database.id)
      await this.initCells(userId, database.id, columns, rows)
    }
    return database
  }

  initColumnsBySchema = async (
    userId: string,
    databaseId: string,
    columnSchema: Required<ColumnSchema>[],
  ) => {
    const newColumns: IColumnNode[] = []
    for (const item of columnSchema) {
      const column = await this.node.createNode<IColumnNode>({
        userId,
        parentId: databaseId,
        databaseId,
        type: NodeType.COLUMN,
        props: item,
      })
      newColumns.push(column)
    }

    return newColumns
  }

  initColumns = async (
    userId: string,
    databaseId: string,
    databaseName = '',
    columnSchema: ColumnSchema[],
  ) => {
    if (columnSchema.length) {
      return this.initColumnsBySchema(userId, databaseId, columnSchema as any)
    }

    const isTodo = databaseName === TODO_DATABASE_NAME
    const isFile = databaseName === FILE_DATABASE_NAME

    const mainColumn = await this.node.createNode<IColumnNode>({
      userId,
      parentId: databaseId,
      databaseId,
      type: NodeType.COLUMN,
      props: {
        displayName: 'Name',
        fieldName: uniqueId(),
        description: '',
        fieldType: FieldType.TEXT,
        isPrimary: true,
        config: {},
      },
    })

    if (isTodo) {
      const source = await this.node.createNode<IColumnNode>({
        userId,
        databaseId,
        parentId: databaseId,
        type: NodeType.COLUMN,
        props: {
          displayName: 'Source',
          fieldName: uniqueId(),
          description: '',
          fieldType: FieldType.TODO_SOURCE,
          isPrimary: false,
          config: {},
        },
      })

      return [mainColumn, source]
    }

    if (isFile) {
      const source = await this.node.createNode<IColumnNode>({
        userId,
        databaseId,
        parentId: databaseId,
        type: NodeType.COLUMN,
        props: {
          displayName: 'File',
          fieldName: uniqueId(),
          description: '',
          fieldType: FieldType.FILE,
          isPrimary: false,
          config: {},
        },
      })

      return [mainColumn, source]
    }

    const column2 = await this.node.createNode<IColumnNode>({
      userId,
      databaseId,
      parentId: databaseId,
      type: NodeType.COLUMN,
      props: {
        displayName: 'Type',
        fieldName: uniqueId(),
        description: '',
        fieldType: FieldType.SINGLE_SELECT,
        isPrimary: false,
        config: {},
      },
    })

    return [mainColumn, column2]
  }

  initRows = async (userId: string, databaseId: string) => {
    return Promise.all([
      this.node.createNode<IRowNode>({
        userId,
        databaseId,
        parentId: databaseId,
        type: NodeType.ROW,
        props: {
          sort: 1,
        },
      }),
      this.node.createNode<IRowNode>({
        userId,
        parentId: databaseId,
        type: NodeType.ROW,
        databaseId,
        props: {
          sort: 2,
        },
      }),
    ])
  }

  initCells = async (
    userId: string,
    databaseId: string,
    columns: IColumnNode[],
    rows: IRowNode[],
  ) => {
    const cellNodes = rows.reduce<ICellNode[]>((result, row) => {
      const cells: ICellNode[] = columns.map(
        (column) =>
          ({
            userId,
            databaseId,
            parentId: databaseId,
            type: NodeType.CELL,
            props: {
              columnId: column.id,
              rowId: row.id,
              data: '',
            },
          }) as ICellNode,
      )
      return [...result, ...cells]
    }, [])
    for (const node of cellNodes) {
      await this.node.createNode(node)
    }
  }

  getDatabase = async (id: string) => {
    const database = (await this.node.getNode(id)) as IDatabaseNode
    const userId = database.userId
    const columns = (await this.penx.node
      .where({
        type: NodeType.COLUMN,
        userId,
        databaseId: id,
      })
      .toArray()) as IColumnNode[]

    const rows = (await this.penx.node
      .where({
        type: NodeType.ROW,
        userId,
        databaseId: id,
      })
      .toArray()) as IRowNode[]

    const views = (await this.penx.node
      .where({
        type: NodeType.VIEW,
        userId,
        databaseId: id,
      })
      .toArray()) as IViewNode[]

    const cells = (await this.penx.node
      .where({
        type: NodeType.CELL,
        userId,
        databaseId: id,
      })
      .toArray()) as ICellNode[]

    const options = (await this.penx.node
      .where({
        type: NodeType.OPTION,
        databaseId: id,
      })
      .toArray()) as IOptionNode[]

    return {
      database,
      views,
      columns,
      rows,
      cells,
      options,
    }
  }

  updateDatabaseProps = async (
    id: string,
    props: Partial<IDatabaseNode['props']>,
  ) => {
    const database = (await this.node.getNode(id)) as IDatabaseNode
    await this.node.updateNode(id, {
      props: {
        ...database.props,
        ...props,
      },
    })
  }

  getDatabaseByName = async (userId: string, name: string) => {
    const nodes = await this.penx.node
      .where({
        type: NodeType.DATABASE,
        userId,
      })
      .toArray()

    const database = nodes.find((node) => node.props.name === name)
    return database!
  }

  getColumnByFieldName = async (databaseId: string, fieldName: string) => {
    const columns = (await this.penx.node
      .where({
        databaseId,
        type: NodeType.COLUMN,
      })
      .toArray()) as IColumnNode[]

    return columns.find((column) => column.props.fieldName === fieldName)
  }

  addView = async (databaseId: string, viewType: ViewType) => {
    const database = (await this.node.getNode(databaseId)) as IDatabaseNode
    const userId = database.userId

    const columns = (await this.penx.node
      .where({
        type: NodeType.COLUMN,
        userId,
        databaseId,
      })
      .toArray()) as IColumnNode[]

    const viewColumns: ViewColumn[] = columns.map((column) => ({
      columnId: column.id,
      width: 160,
      visible: true,
    }))

    let kanbanColumnId = ''
    let kanbanOptionIds: string[] = []

    if (viewType === ViewType.KANBAN) {
      let column = columns.find(
        (c) => c.props.fieldType === FieldType.SINGLE_SELECT,
      )!

      if (column) {
        const options = (await this.penx.node
          .where({
            type: NodeType.OPTION,
            databaseId: database.id,
          })
          .toArray()) as IOptionNode[]

        kanbanOptionIds = options
          .filter((option) => option.props.columnId === column.id)
          .map((option) => option.id)
      } else {
        column = await this.addColumn(databaseId, FieldType.SINGLE_SELECT)
      }

      kanbanColumnId = column.id
    }

    const view = await this.node.createNode<IViewNode>({
      userId: database.userId,
      databaseId: database.id,
      parentId: database.id,
      type: NodeType.VIEW,
      children: columns.map((column) => column.id),
      props: {
        name: viewType.toLowerCase(),
        viewType: viewType,
        viewColumns,
        sorts: [],
        filters: [],
        groups: [],
        kanbanColumnId,
        kanbanOptionIds,
      },
    })

    await this.node.updateNode(database.id, {
      props: {
        ...database.props,
        activeViewId: view.id,
        viewIds: [...(database.props.viewIds || []), view.id],
      },
    })

    return view
  }

  addColumn = async (databaseId: string, fieldType: FieldType) => {
    const nameMap: Record<string, string> = {
      [FieldType.TEXT]: 'Text',
      [FieldType.NUMBER]: 'Number',
      [FieldType.URL]: 'URL',
      [FieldType.PASSWORD]: 'Password',
      [FieldType.SINGLE_SELECT]: 'Single Select',
      [FieldType.MULTIPLE_SELECT]: 'Multiple Select',
      [FieldType.RATE]: 'Rate',
      [FieldType.MARKDOWN]: 'Markdown',
      [FieldType.DATE]: 'Date',
      [FieldType.CREATED_AT]: 'Created At',
      [FieldType.UPDATED_AT]: 'Updated At',
    }

    const database = (await this.node.getNode(databaseId)) as IDatabaseNode
    const userId = database.userId

    const column = await this.node.createNode<IColumnNode>({
      userId,
      databaseId,
      parentId: databaseId,
      type: NodeType.COLUMN,
      props: {
        displayName: nameMap[fieldType] || '',
        fieldName: uniqueId(),
        description: '',
        fieldType,
        isPrimary: false,
        config: {},
      },
    })

    const views = (await this.penx.node
      .where({
        type: NodeType.VIEW,
        userId,
        databaseId,
      })
      .toArray()) as IViewNode[]

    for (const view of views) {
      await this.penx.node.update(view.id, {
        props: {
          ...view.props,
          viewColumns: [
            ...view.props.viewColumns,
            {
              columnId: column.id,
              width: 160,
              visible: true,
            },
          ],
        } as IViewNode['props'],
      })
    }

    const rows = await this.penx.node
      .where({
        type: NodeType.ROW,
        userId,
        databaseId,
      })
      .toArray()

    for (const row of rows) {
      await this.node.createNode<ICellNode>({
        userId,
        databaseId,
        parentId: databaseId,
        type: NodeType.CELL,
        props: {
          columnId: column.id,
          rowId: row.id,
          ref: '',
          data: '',
        },
      })
    }
    return column
  }

  private checkRowsSortNormal = (rows: IRowNode[] = []) => {
    if (!rows.length) return true
    if (!Reflect.has(rows[0]!.props, 'sort')) return false

    const sorts = rows.map((row) => row.props.sort).sort()
    if (!sorts.every((sort, index) => sort === index + 1)) {
      return false
    }
    return true
  }

  private fixRowsSort = async (rows: IRowNode[] = []) => {
    let sort = 1
    const sortedRows = rows.sort((a, b) => a.props.sort - b.props.sort)

    for (const item of sortedRows) {
      await this.node.updateNode<IRowNode>(item.id, {
        props: { ...item.props, sort },
      })
      sort++
    }
  }

  addRow = async (opt: AddRowOptions) => {
    const { databaseId, ref } = opt
    const database = (await this.node.getNode(databaseId)) as IDatabaseNode
    const userId = database.userId

    const rows = (await this.penx.node
      .where({
        type: NodeType.ROW,
        userId,
        databaseId,
      })
      .toArray()) as IRowNode[]

    const isSortNormal = this.checkRowsSortNormal(rows)

    // fix sort
    if (!isSortNormal) {
      await this.fixRowsSort(rows)
    }

    const row = await this.node.createNode<IRowNode>({
      userId,
      databaseId,
      parentId: databaseId,
      type: NodeType.ROW,
      props: {
        sort: rows.length + 1,
      },
    })

    const views = (await this.penx.node
      .where({
        type: NodeType.VIEW,
        userId,
        databaseId,
      })
      .toArray()) as IViewNode[]

    // TODO: too hack, should pass a view id to find a view
    const view = views.find((node) => node.props.viewType === ViewType.TABLE)!

    const columns = await this.penx.node
      .where({
        type: NodeType.COLUMN,
        userId,
        databaseId,
      })
      .toArray()

    const sortedColumns = view.props.viewColumns.map(({ columnId: id }) => {
      const column = columns.find((node) => node.id === id)
      return column!
    })

    const promises = sortedColumns.map((column, index) => {
      const cellProps: ICellNodeProps = {
        columnId: column.id,
        rowId: row.id,
        ref: index === 0 && ref ? ref : '',
        data: '',
      }

      if (opt.type === 'file' && index === 1) {
        cellProps.data = {}
        cellProps.data.fileHash = opt.fileHash
        cellProps.data.googleDriveFileId = opt.googleDriveFileId
      }

      if (opt.type === 'todo' && index === 1) {
        cellProps.data = {}
        cellProps.data.isTodoSource = true
        cellProps.data.sourceId = opt.sourceId
      }

      return this.node.createNode<ICellNode>({
        userId,
        databaseId,
        parentId: databaseId,
        type: NodeType.CELL,
        props: cellProps,
      })
    })

    await Promise.all(promises)
  }

  addRowByFieldName = async ({
    databaseId,
    ...data
  }: AddRowByFieldNameOptions) => {
    const database = (await this.node.getNode(databaseId)) as IDatabaseNode
    const userId = database.userId

    const rows = (await this.penx.node
      .where({
        type: NodeType.ROW,
        userId,
        databaseId,
      })
      .toArray()) as IRowNode[]

    // const isSortNormal = this.checkRowsSortNormal(rows)

    // // fix sort
    // if (!isSortNormal) {
    //   await this.fixRowsSort(rows)
    // }

    const row = await this.node.createNode<IRowNode>({
      userId,
      databaseId,
      parentId: databaseId,
      type: NodeType.ROW,
      props: {
        sort: rows.length + 1,
      },
    })

    const columns = (await this.penx.node
      .where({
        type: NodeType.COLUMN,
        userId,
        databaseId,
      })
      .toArray()) as IColumnNode[]

    const optionMap: Record<string, string[]> = {}

    for (const column of columns) {
      if (
        column.props.fieldType === FieldType.MULTIPLE_SELECT ||
        column.props.fieldType === FieldType.SINGLE_SELECT
      ) {
        const cellData: string[] = data[column.props.fieldName]
        const dataStr = JSON.stringify(cellData)

        if (!Array.isArray(cellData)) {
          const option = await this.addOption(databaseId, column.id, cellData)
          optionMap[dataStr] = [option.id]
        } else {
          const promises = cellData.map((item) =>
            this.addOption(databaseId, column.id, item),
          )
          const options = await Promise.all(promises)
          optionMap[dataStr] = options.map((option) => option.id)
        }
      }
    }

    const promises = columns.map((column, index) => {
      let cellData = data[column.props.fieldName]

      if (
        column.props.fieldType === FieldType.MULTIPLE_SELECT ||
        column.props.fieldType === FieldType.SINGLE_SELECT
      ) {
        const dataStr = JSON.stringify(cellData)
        cellData = optionMap[dataStr]
      }

      return this.node.createNode<ICellNode>({
        userId,
        databaseId,
        parentId: databaseId,
        type: NodeType.CELL,
        props: {
          columnId: column.id,
          rowId: row.id,
          ref: '',
          data: cellData,
        },
      })
    })

    await Promise.all(promises)
  }

  createTodoRow = async (userId: string, ref: string, sourceId: string) => {
    const databases = await this.penx.node
      .where({
        type: NodeType.DATABASE,
        userId,
      })
      .toArray()

    let todoDatabase = databases.find(
      (db) => db.props.name === TODO_DATABASE_NAME,
    )

    if (!todoDatabase) {
      todoDatabase = await this.createDatabase({
        userId,
        name: TODO_DATABASE_NAME,
      })
    }

    // Get all database cells
    const cells = await this.penx.node
      .where({
        type: NodeType.CELL,
        userId,
        databaseId: todoDatabase.id,
      })
      .toArray()

    // check cell is existed
    const cell = cells.find((cell) => cell.props.ref === ref)

    if (!cell) {
      await this.addRow({
        databaseId: todoDatabase.id,
        ref,
        type: 'todo',
        sourceId,
      })
    }
  }

  createFileRow = async (opt: CreateFileRowOptions) => {
    const { userId, ref, fileHash: fileHash, googleDriveFileId } = opt

    const databases = await this.penx.node
      .where({
        type: NodeType.DATABASE,
        userId,
      })
      .toArray()

    let fileDatabase = databases.find(
      (db) => db.props.name === FILE_DATABASE_NAME,
    )

    if (!fileDatabase) {
      fileDatabase = await this.createDatabase({
        userId,
        name: FILE_DATABASE_NAME,
      })
    }

    // Get all database cells
    const cells = (await this.penx.node
      .where({
        type: NodeType.CELL,
        userId,
        databaseId: fileDatabase.id,
      })
      .toArray()) as ICellNode[]

    // check cell is existed
    const cell = cells.find((cell) => cell.props.ref === ref) as ICellNode

    // console.log('=======cell:', cell)

    if (!cell) {
      await this.addRow({
        databaseId: fileDatabase.id,
        ref,
        type: 'file',
        fileHash,
        googleDriveFileId,
      })
    } else {
      // update file cell
      const fileCell = cells.find((c) => {
        if (
          c.props.rowId === cell.props.rowId &&
          typeof c.props.data === 'object'
        ) {
          return Reflect.has(c.props.data, 'googleDriveFileId')
        }
      }) as ICellNode

      if (fileCell) {
        await this.node.updateNode(fileCell.id, {
          props: {
            ...fileCell.props,
            data: {
              fileHash,
              googleDriveFileId,
            },
          },
        })
      }
    }
  }

  createTagRow = async (userId: string, name: string, ref = '') => {
    const tagName = formatTagName(name)
    const databases = await this.penx.node
      .where({
        type: NodeType.DATABASE,
        userId,
      })
      .toArray()

    const database = databases.find((db) => db.props.name === tagName)
    if (!database) return

    // Get all database cells
    const cells = await this.penx.node
      .where({
        type: NodeType.CELL,
        userId,
        databaseId: database.id,
      })
      .toArray()

    // check cell is existed
    const cell = cells.find((cell) => cell.props.ref === ref)

    if (!cell) {
      await this.addRow({
        databaseId: database.id,
        ref,
      })
    }
  }

  /**
   * TODO: need improve performance
   * @param databaseId
   * @param rowId
   * @param deleteRef should delete ref? default is true
   */
  deleteRow = async (databaseId: string, rowId: string, deleteRef = true) => {
    const cells = (await this.penx.node
      .where({
        type: NodeType.CELL,
        databaseId,
      })
      .toArray()) as ICellNode[]

    const promises: any[] = []

    promises.push(this.penx.node.delete(rowId))

    /** should delete primary cell ref */
    if (deleteRef) {
      const primaryCell = cells.find(
        (cell) => !!cell.props.ref && cell.props.rowId === rowId,
      )

      //TODO: need to improvement for a node with many refs
      if (primaryCell) {
        const ref = primaryCell.props.ref
        promises.push(this.penx.node.delete(ref))
      }
    }

    for (const cell of cells) {
      if (cell.props.rowId === rowId) {
        promises.push(this.penx.node.delete(cell.id))
      }
    }

    await Promise.all(promises)

    // Normalize sort
    const rows = (await this.penx.node
      .where({
        type: NodeType.ROW,
        databaseId,
      })
      .toArray()) as IRowNode[]

    await this.fixRowsSort(rows)
  }

  updateCell = async (cellId: string, data: Partial<ICellNode>) => {
    const cell = (await this.node.getNode(cellId)) as ICellNode
    const newNode = await this.node.updateNode(cellId, {
      ...data,
      updatedAt: new Date(),
    })

    await this.node.updateNode(cell.props.rowId, {
      updatedAt: new Date(),
    })

    return newNode
  }

  deleteColumn = async (databaseId: string, columnId: string) => {
    const cells = await this.penx.node
      .where({
        type: NodeType.CELL,
        databaseId,
      })
      .toArray()

    for (const cell of cells) {
      if (cell.props.columnId !== columnId) continue
      await this.node.deleteNode(cell.id)
    }

    const views = (await this.penx.node
      .where({
        type: NodeType.VIEW,
        databaseId: databaseId,
      })
      .toArray()) as IViewNode[]

    for (const view of views) {
      await this.node.updateNode<IViewNode>(view.id, {
        props: {
          ...view.props,
          viewColumns: view.props.viewColumns.filter(
            ({ columnId: id }) => id !== columnId,
          ),
        },
      })
    }

    await this.node.deleteNode(columnId)
  }

  updateColumnName = async (columnId: string, displayName: string) => {
    const column = (await this.node.getNode(columnId)) as IColumnNode
    await this.node.updateNode<IColumnNode>(columnId, {
      props: { ...column.props, displayName },
    })
  }

  updateColumnWidth = async (
    viewId: string,
    columnId: string,
    width: number,
  ) => {
    await this.updateViewColumn(viewId, columnId, { width })
  }

  deleteView = async (databaseId: string, viewId: string) => {
    const database = (await this.node.getNode(databaseId)) as IDatabaseNode
    await this.node.deleteNode(viewId)

    await this.node.updateNode(database.id, {
      props: {
        ...database.props,
        viewIds: database.props?.viewIds.filter((id) => id !== viewId),
      },
    })
  }

  updateView = async (viewId: string, props: Partial<IViewNode['props']>) => {
    const view = await this.node.getNode(viewId)
    await this.node.updateNode(viewId, {
      props: { ...view.props, ...props },
    })
  }

  updateViewColumn = async (
    viewId: string,
    columnId: string,
    props: Partial<ViewColumn>,
  ) => {
    const view = await this.node.getNode<IViewNode>(viewId)
    const { viewColumns = [] } = view.props
    const index = viewColumns.findIndex((item) => item.columnId === columnId)
    viewColumns[index] = { ...viewColumns[index], ...props } as ViewColumn

    await this.node.updateNode<IViewNode>(viewId, {
      props: { ...view.props, viewColumns },
    })
  }

  addSort = async (viewId: string, columnId: string, props: Partial<Sort>) => {
    const view = await this.node.getNode<IViewNode>(viewId)
    await this.node.updateNode<IViewNode>(viewId, {
      props: {
        ...view.props,
        sorts: [
          ...(view.props.sorts || []),
          {
            isAscending: true,
            columnId,
            ...props,
          },
        ],
      },
    })
  }

  deleteSort = async (viewId: string, columnId: string) => {
    const view = await this.node.getNode<IViewNode>(viewId)
    await this.node.updateNode<IViewNode>(viewId, {
      props: {
        ...view.props,
        sorts: view.props.sorts?.filter((s) => s.columnId !== columnId),
      },
    })
  }

  addGroup = async (
    viewId: string,
    columnId: string,
    props: Partial<Group>,
  ) => {
    const view = await this.node.getNode<IViewNode>(viewId)
    await this.node.updateNode<IViewNode>(viewId, {
      props: {
        ...view.props,
        groups: [
          ...(view.props.groups || []),
          {
            showEmptyGroup: false,
            isAscending: true,
            columnId,
            ...props,
          },
        ],
      },
    })
  }

  deleteGroup = async (viewId: string, columnId: string) => {
    const view = await this.node.getNode<IViewNode>(viewId)
    await this.node.updateNode<IViewNode>(viewId, {
      props: {
        ...view.props,
        groups: view.props.groups?.filter((s) => s.columnId !== columnId),
      },
    })
  }

  addFilter = async (
    viewId: string,
    columnId: string,
    props: Partial<Filter>,
  ) => {
    const view = await this.node.getNode<IViewNode>(viewId)
    await this.node.updateNode<IViewNode>(viewId, {
      props: {
        ...view.props,
        filters: [
          ...(view.props.filters || []),
          {
            ...props,
            columnId,
            conjunction: ConjunctionType.AND,
          } as Filter,
        ],
      },
    })
  }

  updateFilter = async (
    viewId: string,
    columnId: string,
    newColumnId: string,
    props?: Partial<Filter>,
  ) => {
    const view = await this.node.getNode<IViewNode>(viewId)
    const filters = view.props.filters
    const filterIndex = filters.findIndex((item) => item.columnId === columnId)
    if (filterIndex >= 0) {
      filters[filterIndex] = {
        ...filters[filterIndex],
        columnId: newColumnId,
        ...props,
      } as Filter
    }

    await this.node.updateNode<IViewNode>(viewId, {
      props: {
        ...view.props,
        filters,
      },
    })
  }

  deleteFilter = async (viewId: string, columnId: string) => {
    const view = await this.node.getNode<IViewNode>(viewId)
    await this.node.updateNode<IViewNode>(viewId, {
      props: {
        ...view.props,
        filters: view.props.filters?.filter((s) => s.columnId !== columnId),
      },
    })
  }

  applyFilter = async (viewId: string, filters: Filter[]) => {
    const view = await this.node.getNode<IViewNode>(viewId)
    await this.node.updateNode<IViewNode>(viewId, {
      props: {
        ...view.props,
        filters,
      },
    })
  }

  addOption = async (databaseId: string, columnId: string, name: string) => {
    const database = (await this.node.getNode(databaseId)) as IDatabaseNode
    const userId = database.userId

    const options = await this.penx.node
      .where({
        databaseId,
        type: NodeType.OPTION,
      })
      .toArray()

    const find = options.find((item) => item.props.name === name)

    if (find) {
      return find as IOptionNode
    }

    const newOption = await this.node.createNode<IOptionNode>({
      userId,
      databaseId,
      parentId: databaseId,
      type: NodeType.OPTION,
      props: {
        columnId,
        name,
        color: getRandomColor(),
      },
    })

    const column = await this.node.getNode(columnId)

    await this.node.updateNode(columnId, {
      props: {
        ...column.props,
        optionIds: [...(column.props.optionIds || []), newOption.id],
      },
    })

    return newOption
  }

  updateColumnOptions = async (
    columnId: string,
    options: Array<{
      id: string
      name: string
      color: string
    }>,
  ) => {
    const column = await this.node.getNode(columnId)
    const oldOptionIds: string[] = column.props.optionIds || []
    const newOptionIds = options.map((option) => option.id)
    const deletedIds = oldOptionIds.filter((id) => !newOptionIds.includes(id))

    for (const id of deletedIds) {
      // update column
      await this.node.updateNode(column.id, {
        props: {
          ...column.props,
          optionIds: newOptionIds,
        },
      })

      const cells = await this.penx.node
        .where({
          type: NodeType.CELL,
          databaseId: column.databaseId!,
        })
        .toArray()

      // delete option
      for (const cell of cells) {
        if (!Array.isArray(cell.props.data)) continue
        if (!cell.props.data.includes(id)) continue
        await this.node.updateNode(cell.id, {
          props: {
            ...cell.props,
            data: cell.props.data.filter((id) => id !== id),
          },
        })
      }
    }

    // update newOptionIds
    for (const { id, ...rest } of options) {
      const option = await this.node.getNode(id)
      await this.node.updateNode(id, {
        props: {
          ...option.props,
          ...rest,
        },
      })
    }
  }

  deleteCellOption = async (cellId: string, optionId: string) => {
    const cell = await this.node.getNode(cellId)

    const optionIds: string[] = Array.isArray(cell.props.data)
      ? cell.props.data
      : []

    await this.node.updateNode(cell.id, {
      props: {
        ...cell.props,
        data: optionIds.filter((id) => id !== optionId),
      },
    })
  }

  moveColumn = async (
    databaseId: string,
    viewId: string,
    fromIndex: number,
    toIndex: number,
  ) => {
    const views = (await this.penx.node
      .where({
        type: NodeType.VIEW,
        databaseId: databaseId,
      })
      .toArray()) as IViewNode[]

    const view = views.find((node) => node.id === viewId)!

    const columns = await this.penx.node
      .where({
        type: NodeType.COLUMN,
        databaseId,
      })
      .toArray()

    if (!columns[fromIndex] || !columns[toIndex]) return

    await this.node.updateNode<IViewNode>(view.id, {
      props: {
        ...view.props,
        viewColumns: arrayMoveImmutable(
          view.props.viewColumns,
          fromIndex,
          toIndex,
        ),
      },
    })
  }

  deleteDatabase = async (node: IDatabaseNode) => {
    const deleteCount = await this.penx.node
      .where({
        databaseId: node.id,
      })
      .delete()
    console.log('===========deleteCount:', deleteCount)

    await this.node.deleteNode(node.id)

    const databaseRoot = await this.getDatabaseRootNode(node.userId)

    await this.node.updateNode(databaseRoot.id, {
      children: databaseRoot.children?.filter((id) => id !== node.id),
    })
  }
}

export const databaseDomain = new DatabaseDomain(penxDB, nodeDomain)
