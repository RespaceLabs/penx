import { arrayMoveImmutable } from 'array-move'
import { format } from 'date-fns'
import Dexie, { Table } from 'dexie'
import { get, set } from 'idb-keyval'
import { PENX_SESSION_USER_ID, TODO_DATABASE_NAME } from '@penx/constants'
import {
  ConjunctionType,
  DataSource,
  FieldType,
  Filter,
  Group,
  ICellNode,
  IColumnNode,
  IDailyRootNode,
  IDatabaseNode,
  IExtension,
  IFile,
  INode,
  IOptionNode,
  IRootNode,
  IRowNode,
  ISpace,
  IViewNode,
  NodeType,
  OperatorType,
  Sort,
  ViewColumn,
  ViewType,
} from '@penx/model-types'
import { uniqueId } from '@penx/unique-id'
import { getNewNode } from './getNewNode'
import { getNewSpace } from './getNewSpace'
import { getRandomColor } from './getRandomColor'

const DAILY_NODE_NORMALIZED = 'DAILY_NODE_NORMALIZED'

export class PenxDB extends Dexie {
  space!: Table<ISpace, string>
  node!: Table<INode, string>
  extension!: Table<IExtension, string>

  constructor() {
    // super('PenxDB')
    super('penx-local')
    this.version(1).stores({
      // Primary key and indexed props
      space: 'id, name, userId',
      node: 'id, spaceId, databaseId, type, date',
    })
  }

  /**
   * Fall old data
   * @returns
   */
  async normalizeDailyNodes(spaceId: string) {
    const normalized = await get(DAILY_NODE_NORMALIZED)

    if (normalized) return true

    const dailyNodes = await this.node
      .where({ type: NodeType.DAILY, spaceId })
      .toArray()

    for (const node of dailyNodes) {
      if (node.date) continue
      if (!node.props?.date) {
        await this.node.delete(node.id)
      } else {
        await this.node.update(node.id, { date: node.props.date })
      }
    }

    set(DAILY_NODE_NORMALIZED, true)
  }

  getLastUpdatedAt = async (spaceId: string): Promise<number> => {
    const oldNodes = await this.listNodesBySpaceId(spaceId)

    if (!oldNodes.length) return 0

    const at = Math.max(...oldNodes.map((n) => new Date(n.updatedAt).getTime()))
    return at
  }

  private async initSpaceNodes(space: ISpace) {
    const spaceId = space.id
    await this.node.add(
      getNewNode(
        {
          spaceId,
          type: NodeType.ROOT,
        },
        space.name,
      ),
    )

    // init inbox node
    await this.createInboxNode(space.id)

    // init trash node
    await this.node.add(
      getNewNode({
        spaceId,
        type: NodeType.TRASH,
      }),
    )

    // init favorite node
    await this.node.add(
      getNewNode({
        spaceId,
        type: NodeType.FAVORITE,
      }),
    )

    // init database root node
    await this.node.add(
      getNewNode({
        spaceId,
        type: NodeType.DATABASE_ROOT,
      }),
    )

    // init daily root node
    const dailyRoot = await this.createNode(
      getNewNode({
        spaceId,
        type: NodeType.DAILY_ROOT,
      }),
    )

    const node = await this.createDailyNode(
      getNewNode({
        parentId: dailyRoot.id,
        spaceId,
        type: NodeType.DAILY,
        date: formatToDate(new Date()),
      }),
    )

    await this.updateSpace(spaceId, {
      isActive: true,
      activeNodeIds: [node.id],
    })

    await this.createDatabase(TODO_DATABASE_NAME, DataSource.COMMON)
  }

  createSpace = async (data: Partial<ISpace>, initNode = true) => {
    const spaces = await this.listSpaces()

    for (const space of spaces) {
      await this.updateSpace(space.id, {
        isActive: false,
      })
    }

    // insert new space
    const newSpace = getNewSpace(data)
    const spaceId = await this.space.add(newSpace)
    const space = (await this.space.get(spaceId))!

    if (initNode) {
      await this.initSpaceNodes(space)
    }

    return space as ISpace
  }

  createSpaceByRemote = async (data: Partial<ISpace>) => {
    return await this.createSpace(data)
  }

  selectSpace = async (spaceId: string) => {
    const spaces = await this.listSpaces()

    for (const space of spaces) {
      await this.space.update(space.id, {
        isActive: false,
      })
    }

    return await this.space.update(spaceId, {
      isActive: true,
    })
  }

  listSpaces = async (userId?: string) => {
    const uid = userId ?? (await get(PENX_SESSION_USER_ID))

    const spaces = await this.space.where({ userId: uid }).toArray()
    return spaces
  }

  getSpace = (spaceId: string) => {
    return this.space.get(spaceId) as any as Promise<ISpace>
  }

  getActiveSpace = async () => {
    const spaces = await this.listSpaces()

    const space = spaces.find((space) => space.isActive)
    return space!
  }

  updateSpace = (spaceId: string, space: Partial<ISpace>) => {
    return this.space.update(spaceId, space)
  }

  deleteSpace = async (spaceId: string) => {
    const nodes = await this.listNodesBySpaceId(spaceId)
    for (const node of nodes) {
      await this.deleteNode(node.id)
    }
    await this.space.delete(spaceId)
    const spaces = await this.listSpaces()
    if (spaces.length) {
      await this.updateSpace(spaces?.[0]?.id!, { isActive: true })
    }
  }

  getNode = <T = INode>(nodeId: string) => {
    return this.node.get(nodeId) as any as Promise<T>
  }

  getRootNode = async (spaceId: string) => {
    const node = await this.node
      .where({
        type: NodeType.ROOT,
        spaceId,
      })
      .first()
    return node as IRootNode
  }

  getDatabaseRootNode = async (spaceId: string) => {
    const node = await this.node
      .where({
        type: NodeType.DATABASE_ROOT,
        spaceId,
      })
      .first()
    return node as IDatabaseNode
  }

  getDailyRootNode = async (spaceId: string) => {
    const node = await this.node
      .where({
        type: NodeType.DAILY_ROOT,
        spaceId,
      })
      .first()
    return node as IDailyRootNode
  }

  getInboxNode = async (spaceId: string) => {
    const node = await this.node
      .where({
        type: NodeType.INBOX,
        spaceId,
      })
      .first()
    return node as INode
  }

  getTrashNode = async (spaceId: string) => {
    const node = await this.node
      .where({
        type: NodeType.TRASH,
        spaceId,
      })
      .first()
    return node as INode
  }

  getTodayNode = async (spaceId: string) => {
    let nodes = await this.node
      .where({ type: NodeType.DAILY, spaceId })
      .toArray()

    return nodes.find((node) => node.date === formatToDate(new Date()))!
  }

  getFavoriteNode = async (spaceId: string) => {
    let nodes = await this.node
      .where({
        type: NodeType.FAVORITE,
      })
      .toArray()
    return nodes.find((node) => node.spaceId === spaceId)!
  }

  updateNode = async <T extends INode>(nodeId: string, data: Partial<T>) => {
    const newData: any = data || {}
    if (!Reflect.has(data, 'updatedAt')) {
      newData.updatedAt = new Date()
    }

    await this.node.update(nodeId, newData)
    return this.node.get(nodeId) as any as Promise<T>
  }

  updateNodeProps = async (nodeId: string, props: Partial<INode['props']>) => {
    const newNode = await this.node.update(nodeId, {
      props,
    })

    return newNode
  }

  deleteNode = async (nodeId: string) => {
    return this.node.delete(nodeId)
  }

  getSpaceNode = async (spaceId: string) => {
    const spaceNodes = await this.node.where({ type: NodeType.ROOT }).toArray()
    const spaceNode = spaceNodes.find((node) => node.spaceId === spaceId)
    return spaceNode!
  }

  createPageNode = async (node: Partial<INode>, space: ISpace) => {
    const { spaceId = '' } = node

    const subNode = await this.createNode(getNewNode({ spaceId }))

    const newNode = await this.createNode({
      ...getNewNode({ spaceId: node.spaceId! }),
      ...node,
      children: [subNode.id],
    })

    const spaceNode = await this.getSpaceNode(space.id)

    await this.updateNode(spaceNode.id, {
      children: [...(spaceNode.children || []), newNode.id],
    })

    return newNode
  }

  createDailyNode = async (node: Partial<INode>) => {
    const { spaceId = '' } = node
    const dailyRootNode = await this.getDailyRootNode(spaceId)
    const subNode = await this.createNode(getNewNode({ spaceId }))

    const dailyNode = await this.createNode({
      ...getNewNode({ spaceId: node.spaceId!, type: NodeType.DAILY }),
      ...node,
      parentId: dailyRootNode.id,
      collapsed: true,
      children: [subNode.id],
    })

    await this.updateNode(subNode.id, {
      parentId: dailyNode.id,
    })

    await this.updateNode(dailyRootNode.id, {
      children: [...(dailyRootNode.children || []), dailyNode.id],
    })

    return dailyNode
  }

  getOrCreateTodayNode = async (spaceId: string) => {
    let todayNode = await this.getTodayNode(spaceId)

    if (!todayNode) {
      todayNode = await this.createDailyNode({
        spaceId,
        date: formatToDate(new Date()),
      })
    }

    return todayNode
  }

  createInboxNode = async (spaceId: string) => {
    const subNode = await this.createNode(getNewNode({ spaceId }))

    const inboxNode = await this.createNode({
      ...getNewNode({ spaceId, type: NodeType.INBOX }),
      children: [subNode.id],
    })

    return inboxNode
  }

  createNode = async <T extends INode>(
    node: Partial<T> & { spaceId: string },
  ): Promise<T> => {
    const newNodeId = await this.node.add({
      ...getNewNode({ spaceId: node.spaceId! }),
      ...node,
    })

    return this.node.get(newNodeId) as any as Promise<T>
  }

  createTextNode = async (spaceId: string, text: string) => {
    const newNode = await this.createNode({
      ...getNewNode({ spaceId }, text),
    })

    return newNode
  }

  addTextToToday = async (spaceId: string, text: string) => {
    const todayNode = await this.getOrCreateTodayNode(spaceId)

    const newNode = await this.createNode({
      ...getNewNode({ spaceId }, text),
    })

    const newTodayNode = await this.updateNode(todayNode.id, {
      children: [...(todayNode.children || []), newNode.id],
    })

    return {
      node: newNode,
      todayNode: newTodayNode,
    }
  }

  addNodesToToday = async (spaceId: string, nodes: INode[]) => {
    const todayNode = await this.getOrCreateTodayNode(spaceId)

    for (const node of nodes) {
      await this.createNode({
        parentId: node.parentId || todayNode.id,
        ...node,
      })
    }

    const newIds = nodes.filter((n) => !n.parentId).map((n) => n.id)

    const newTodayNode = await this.updateNode(todayNode.id, {
      children: [...(todayNode.children || []), ...newIds],
    })
    return newTodayNode
  }

  listNodesBySpaceId = (spaceId: string) => {
    return this.node.where({ spaceId }).toArray()
  }

  listNodesByIds = (nodeIds: string[]) => {
    return this.node.where('id').anyOf(nodeIds).toArray()
  }

  deleteNodeByIds = (nodeIds: string[]) => {
    return this.node.where('id').anyOf(nodeIds).delete()
  }

  createExtension(extension: IExtension) {
    return this.extension.add(extension)
  }

  getExtension = (extensionId: string) => {
    return this.extension.get(extensionId)
  }

  updateExtension = (extensionId: string, plugin: Partial<IExtension>) => {
    return this.extension.update(extensionId, plugin)
  }

  installExtension = async (extension: Partial<IExtension>) => {
    const list = await this.extension
      .where({
        spaceId: extension.spaceId!,
        slug: extension.slug!,
      })
      .toArray()

    if (list?.length) {
      const ext = list[0]!
      return this.extension.update(ext.id, {
        ...ext,
        ...extension,
      })
    }

    return this.extension.add({
      id: uniqueId(),
      ...extension,
    } as IExtension)
  }

  listExtensions = () => {
    return this.extension.toArray()
  }

  createDatabase = async (
    name: string,
    dataSource: DataSource = DataSource.TAG,
    shouldInitCell = false,
  ) => {
    const space = await this.getActiveSpace()

    const databaseRootNode = await this.getDatabaseRootNode(space.id)

    const database = await this.createNode<IDatabaseNode>({
      parentId: databaseRootNode.id,
      spaceId: space.id,
      type: NodeType.DATABASE,
      props: {
        color: getRandomColor(),
        dataSource,
        name,
        activeViewId: '',
        viewIds: [],
      },
    })

    await this.updateNode(databaseRootNode.id, {
      children: [...(databaseRootNode.children || []), database.id],
    })

    const isTodo = name === TODO_DATABASE_NAME
    const columns = await this.initColumns(space.id, database.id, isTodo)

    const viewColumns: ViewColumn[] = columns.map((column) => ({
      columnId: column.id,
      width: 160,
      visible: true,
    }))

    // init table view
    const tableView = await this.createNode<IViewNode>({
      spaceId: space.id,
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
    const listView = await this.createNode<IViewNode>({
      spaceId: space.id,
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

    await this.updateNode(database.id, {
      props: {
        ...database.props,
        activeViewId: tableView.id,
        viewIds: [tableView.id, listView.id],
      },
    })

    if (shouldInitCell) {
      const rows = await this.initRows(space.id, database.id)
      await this.initCells(space.id, database.id, columns, rows)
    }
    return database
  }

  initColumns = async (spaceId: string, databaseId: string, isTodo = false) => {
    const mainColumn = await this.createNode<IColumnNode>({
      spaceId,
      parentId: databaseId,
      databaseId,
      type: NodeType.COLUMN,
      props: {
        name: 'Name',
        description: '',
        fieldType: FieldType.TEXT,
        isPrimary: true,
        config: {},
      },
    })
    if (isTodo) {
      const source = await this.createNode<IColumnNode>({
        spaceId,
        databaseId,
        parentId: databaseId,
        type: NodeType.COLUMN,
        props: {
          name: 'Source',
          description: '',
          fieldType: FieldType.NODE_ID,
          isPrimary: false,
          config: {},
        },
      })

      const createdAt = await this.createNode<IColumnNode>({
        spaceId,
        databaseId,
        parentId: databaseId,
        type: NodeType.COLUMN,
        props: {
          name: 'Created At',
          description: '',
          fieldType: FieldType.CREATED_AT,
          isPrimary: false,
          config: {},
        },
      })

      const updatedAt = await this.createNode<IColumnNode>({
        spaceId,
        databaseId,
        parentId: databaseId,
        type: NodeType.COLUMN,
        props: {
          name: 'Updated At',
          description: '',
          fieldType: FieldType.UPDATED_AT,
          isPrimary: false,
          config: {},
        },
      })

      return [mainColumn, source, createdAt, updatedAt]
    }
    const column2 = await this.createNode<IColumnNode>({
      spaceId,
      databaseId,
      parentId: databaseId,
      type: NodeType.COLUMN,
      props: {
        name: 'Type',
        description: '',
        fieldType: FieldType.SINGLE_SELECT,
        isPrimary: false,
        config: {},
      },
    })

    return [mainColumn, column2]
  }

  initRows = async (spaceId: string, databaseId: string) => {
    return Promise.all([
      this.createNode<IRowNode>({
        spaceId,
        databaseId,
        parentId: databaseId,
        type: NodeType.ROW,
        props: {
          sort: 1,
        },
      }),
      this.createNode<IRowNode>({
        spaceId,
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
    spaceId: string,
    databaseId: string,
    columns: IColumnNode[],
    rows: IRowNode[],
  ) => {
    const cellNodes = rows.reduce<ICellNode[]>((result, row) => {
      const cells: ICellNode[] = columns.map(
        (column) =>
          ({
            spaceId,
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
      await this.createNode(node)
    }
  }

  getDatabase = async (id: string) => {
    const space = await this.getActiveSpace()
    const database = await this.getNode(id)
    const columns = await this.node
      .where({
        type: NodeType.COLUMN,
        spaceId: space.id,
        databaseId: id,
      })
      .toArray()

    const rows = await this.node
      .where({
        type: NodeType.ROW,
        spaceId: space.id,
        databaseId: id,
      })
      .toArray()

    const views = await this.node
      .where({
        type: NodeType.VIEW,
        spaceId: space.id,
        databaseId: id,
      })
      .toArray()

    const cells = await this.node
      .where({
        type: NodeType.CELL,
        spaceId: space.id,
        databaseId: id,
      })
      .toArray()

    return {
      database,
      views,
      columns,
      rows,
      cells,
    }
  }

  getDatabaseByName = async (name: string) => {
    const space = await this.getActiveSpace()
    const nodes = await this.node
      .where({
        type: NodeType.DATABASE,
        spaceId: space.id,
      })
      .toArray()

    const database = nodes.find((node) => node.props.name === name)
    return database!
  }

  addView = async (databaseId: string, viewType: ViewType) => {
    const database = (await this.getNode(databaseId)) as IDatabaseNode

    const columns = (await this.node
      .where({
        type: NodeType.COLUMN,
        spaceId: database.spaceId,
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
        const options = (await this.node
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

    const view = await this.createNode<IViewNode>({
      spaceId: database.spaceId,
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

    await this.updateNode(database.id, {
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

    const space = await this.getActiveSpace()
    const spaceId = space.id

    const column = await this.createNode<IColumnNode>({
      spaceId,
      databaseId,
      parentId: databaseId,
      type: NodeType.COLUMN,
      props: {
        name: nameMap[fieldType] || '',
        description: '',
        fieldType,
        isPrimary: false,
        config: {},
      },
    })

    const views = (await this.node
      .where({
        where: {
          type: NodeType.VIEW,
          spaceId: space.id,
          databaseId: databaseId,
        },
      })
      .toArray()) as IViewNode[]

    for (const view of views) {
      await this.node.update(view.id, {
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
        },
      } as IViewNode)
    }

    const rows = await this.node
      .where({
        type: NodeType.ROW,
        spaceId,
        databaseId,
      })
      .toArray()

    for (const row of rows) {
      await this.createNode<ICellNode>({
        spaceId,
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

  private checkRowsSortNormal(rows: IRowNode[] = []) {
    if (!rows.length) return true
    if (!Reflect.has(rows[0]!.props, 'sort')) return false

    const sorts = rows.map((row) => row.props.sort).sort()
    if (!sorts.every((sort, index) => sort === index + 1)) {
      return false
    }
    return true
  }

  private async fixRowsSort(rows: IRowNode[] = []) {
    let sort = 1
    const sortedRows = rows.sort((a, b) => a.props.sort - b.props.sort)

    for (const item of sortedRows) {
      await this.updateNode<IRowNode>(item.id, {
        props: { ...item.props, sort },
      })
      sort++
    }
  }

  addRow = async (databaseId: string, ref = '', source = '') => {
    const space = await this.getActiveSpace()
    const spaceId = space.id

    const rows = (await this.node
      .where({
        type: NodeType.ROW,
        spaceId: space.id,
        databaseId,
      })
      .toArray()) as IRowNode[]

    const isSortNormal = this.checkRowsSortNormal(rows)

    // fix sort
    if (!isSortNormal) {
      await this.fixRowsSort(rows)
    }

    const row = await this.createNode<IRowNode>({
      spaceId,
      databaseId,
      parentId: databaseId,
      type: NodeType.ROW,
      props: {
        sort: rows.length + 1,
      },
    })

    const views = (await this.node
      .where({
        type: NodeType.VIEW,
        spaceId: space.id,
        databaseId,
      })
      .toArray()) as IViewNode[]

    // TODO: too hack, should pass a view id to find a view
    const view = views.find((node) => node.props.viewType === ViewType.TABLE)!

    const columns = await this.node
      .where({
        type: NodeType.COLUMN,
        spaceId,
        databaseId,
      })
      .toArray()

    const sortedColumns = view.props.viewColumns.map(({ columnId: id }) => {
      const column = columns.find((node) => node.id === id)
      return column!
    })

    const promises = sortedColumns.map((column, index) =>
      this.createNode<ICellNode>({
        spaceId,
        databaseId,
        parentId: databaseId,
        type: NodeType.CELL,
        props: {
          columnId: column.id,
          rowId: row.id,
          ref: index === 0 ? ref : '',
          data: source && index === 1 ? source : '',
          isTodoSource: !!source && index === 1,
        },
      }),
    )

    await Promise.all(promises)
  }

  createTodoRow = async (ref = '', sourceId = '') => {
    const space = await this.getActiveSpace()
    const databases = await this.node
      .where({
        type: NodeType.DATABASE,
        spaceId: space.id,
      })
      .toArray()

    let todoDatabase = databases.find(
      (db) => db.props.name === TODO_DATABASE_NAME,
    )

    if (!todoDatabase) {
      todoDatabase = await this.createDatabase(
        TODO_DATABASE_NAME,
        DataSource.COMMON,
      )
    }

    // Get all database cells
    const cells = await this.node
      .where({
        type: NodeType.CELL,
        spaceId: space.id,
        databaseId: todoDatabase.id,
      })
      .toArray()

    // check cell is existed
    const cell = cells.find((cell) => cell.props.ref === ref)

    if (!cell) {
      await this.addRow(todoDatabase.id, ref, sourceId)
    }
  }

  createTagRow = async (name: string, ref = '') => {
    const space = await this.getActiveSpace()
    const databases = await this.node
      .where({
        type: NodeType.DATABASE,
        spaceId: space.id,
      })
      .toArray()

    const database = databases.find((db) => db.props.name === name)
    if (!database) return

    // Get all database cells
    const cells = await this.node
      .where({
        type: NodeType.CELL,
        spaceId: space.id,
        databaseId: database.id,
      })
      .toArray()

    // check cell is existed
    const cell = cells.find((cell) => cell.props.ref === ref)

    if (!cell) {
      await this.addRow(database.id, ref)
    }
  }

  // TODO: need improve performance
  deleteRow = async (databaseId: string, rowId: string) => {
    const cells = (await this.node
      .where({
        type: NodeType.CELL,
        databaseId,
      })
      .toArray()) as ICellNode[]

    const primaryCell = cells.find(
      (cell) => !!cell.props.ref && cell.props.rowId === rowId,
    )

    const promises: any[] = []

    promises.push(this.node.delete(rowId))

    //TODO: need to improvement for a node with many refs
    if (primaryCell) {
      const ref = primaryCell.props.ref
      promises.push(this.node.delete(ref))
    }

    for (const cell of cells) {
      if (cell.props.rowId === rowId) {
        promises.push(this.node.delete(cell.id))
      }
    }

    await Promise.all(promises)

    const rows = (await this.node
      .where({
        type: NodeType.ROW,
        databaseId,
      })
      .toArray()) as IRowNode[]

    await this.fixRowsSort(rows)
  }

  updateCell = async (cellId: string, data: Partial<ICellNode>) => {
    const cell = (await this.getNode(cellId)) as ICellNode
    const newNode = await this.updateNode(cellId, {
      ...data,
      updatedAt: new Date(),
    })

    await this.updateNode(cell.props.rowId, {
      updatedAt: new Date(),
    })

    return newNode
  }

  deleteColumn = async (databaseId: string, columnId: string) => {
    const cells = await this.node
      .where({
        type: NodeType.CELL,
        databaseId,
      })
      .toArray()

    for (const cell of cells) {
      if (cell.props.columnId !== columnId) continue
      await this.deleteNode(cell.id)
    }

    const views = (await this.node
      .where({
        type: NodeType.VIEW,
        databaseId: databaseId,
      })
      .toArray()) as IViewNode[]

    for (const view of views) {
      await this.updateNode<IViewNode>(view.id, {
        props: {
          ...view.props,
          viewColumns: view.props.viewColumns.filter(
            ({ columnId: id }) => id !== columnId,
          ),
        },
      })
    }

    await this.deleteNode(columnId)
  }

  updateColumnName = async (columnId: string, name: string) => {
    const column = await this.getNode(columnId)
    await this.updateNode(columnId, {
      props: { ...column.props, name },
    })
  }

  deleteView = async (databaseId: string, viewId: string) => {
    const database = (await this.getNode(databaseId)) as IDatabaseNode
    await this.deleteNode(viewId)

    await this.updateNode(database.id, {
      props: {
        ...database.props,
        viewIds: database.props?.viewIds.filter((id) => id !== viewId),
      },
    })
  }

  updateView = async (viewId: string, props: Partial<IViewNode['props']>) => {
    const view = await this.getNode(viewId)
    await this.updateNode(viewId, {
      props: { ...view.props, ...props },
    })
  }

  updateViewColumn = async (
    viewId: string,
    columnId: string,
    props: Partial<ViewColumn>,
  ) => {
    const view = await this.getNode<IViewNode>(viewId)
    const { viewColumns = [] } = view.props
    const index = viewColumns.findIndex((item) => item.columnId === columnId)
    viewColumns[index] = { ...viewColumns[index], ...props } as ViewColumn

    await this.updateNode<IViewNode>(viewId, {
      props: { ...view.props, viewColumns },
    })
  }

  addSort = async (viewId: string, columnId: string, props: Partial<Sort>) => {
    const view = await this.getNode<IViewNode>(viewId)
    await this.updateNode<IViewNode>(viewId, {
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
    const view = await this.getNode<IViewNode>(viewId)
    await this.updateNode<IViewNode>(viewId, {
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
    const view = await this.getNode<IViewNode>(viewId)
    await this.updateNode<IViewNode>(viewId, {
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
    const view = await this.getNode<IViewNode>(viewId)
    await this.updateNode<IViewNode>(viewId, {
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
    const view = await this.getNode<IViewNode>(viewId)
    await this.updateNode<IViewNode>(viewId, {
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
    const view = await this.getNode<IViewNode>(viewId)
    const filters = view.props.filters
    const filterIndex = filters.findIndex((item) => item.columnId === columnId)
    if (filterIndex >= 0) {
      filters[filterIndex] = {
        ...filters[filterIndex],
        columnId: newColumnId,
        ...props,
      } as Filter
    }

    await this.updateNode<IViewNode>(viewId, {
      props: {
        ...view.props,
        filters,
      },
    })
  }

  deleteFilter = async (viewId: string, columnId: string) => {
    const view = await this.getNode<IViewNode>(viewId)
    await this.updateNode<IViewNode>(viewId, {
      props: {
        ...view.props,
        filters: view.props.filters?.filter((s) => s.columnId !== columnId),
      },
    })
  }

  appleyFilter = async (viewId: string, filters: Filter[]) => {
    const view = await this.getNode<IViewNode>(viewId)
    await this.updateNode<IViewNode>(viewId, {
      props: {
        ...view.props,
        filters,
      },
    })
  }

  addOption = async (databaseId: string, columnId: string, name: string) => {
    const space = await this.getActiveSpace()

    const option = await this.createNode<IOptionNode>({
      spaceId: space.id,
      databaseId,
      parentId: databaseId,
      type: NodeType.OPTION,
      props: {
        columnId,
        name,
        color: getRandomColor(),
      },
    })

    const column = await this.getNode(columnId)

    await this.updateNode(columnId, {
      props: {
        ...column.props,
        optionIds: [...(column.props.optionIds || []), option.id],
      },
    })

    return option
  }

  updateColumnOptions = async (
    columnId: string,
    options: Array<{
      id: string
      name: string
      color: string
    }>,
  ) => {
    const column = await this.getNode(columnId)
    const oldOptionIds: string[] = column.props.optionIds || []
    const newOptionIds = options.map((option) => option.id)
    const deletedIds = oldOptionIds.filter((id) => !newOptionIds.includes(id))

    for (const id of deletedIds) {
      // update column
      await this.updateNode(column.id, {
        props: {
          ...column.props,
          optionIds: newOptionIds,
        },
      })

      const cells = await this.node
        .where({
          type: NodeType.CELL,
          databaseId: column.databaseId!,
        })
        .toArray()

      // delete option
      for (const cell of cells) {
        if (!Array.isArray(cell.props.data)) continue
        if (!cell.props.data.includes(id)) continue
        await this.updateNode(cell.id, {
          props: {
            ...cell.props,
            data: cell.props.data.filter((id) => id !== id),
          },
        })
      }
    }

    // update newOptionIds
    for (const { id, ...rest } of options) {
      const option = await this.getNode(id)
      await this.updateNode(id, {
        props: {
          ...option.props,
          ...rest,
        },
      })
    }
  }

  deleteCellOption = async (cellId: string, optionId: string) => {
    const cell = await this.getNode(cellId)

    const optionIds: string[] = Array.isArray(cell.props.data)
      ? cell.props.data
      : []

    await this.updateNode(cell.id, {
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
    const views = (await this.node
      .where({
        type: NodeType.VIEW,
        databaseId: databaseId,
      })
      .toArray()) as IViewNode[]

    const view = views.find((node) => node.id === viewId)!

    const columns = await this.node
      .where({
        type: NodeType.COLUMN,
        databaseId,
      })
      .toArray()

    if (!columns[fromIndex] || !columns[toIndex]) return

    await this.updateNode<IViewNode>(view.id, {
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

  deleteDatabase = async (node: INode) => {
    const nodes = await this.node
      .where({
        databaseId: node.id,
      })
      .toArray()

    let promises: Promise<any>[] = []

    for (const item of nodes) {
      promises.push(this.node.delete(item.id))
    }

    await Promise.all(promises)

    const databaseRoot = await this.getDatabaseRootNode(node.spaceId)

    await this.updateNode(databaseRoot.id, {
      children: databaseRoot.children?.filter((id) => id !== node.id),
    })
  }
}

export const db = new PenxDB()

function formatToDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}
