import { arrayMoveImmutable } from 'array-move'
import { format } from 'date-fns'
import { PENX_101 } from '@penx/constants'
import { Database } from '@penx/indexeddb'
import {
  FieldType,
  ICellNode,
  IColumnNode,
  IDatabaseNode,
  IExtension,
  IFile,
  INode,
  IOptionNode,
  IRowNode,
  ISpace,
  IViewNode,
  NodeType,
  Sort,
  ViewColumn,
  ViewType,
} from '@penx/model-types'
import { uniqueId } from '@penx/unique-id'
import { getNewNode } from './getNewNode'
import { getNewSpace } from './getNewSpace'
import { getRandomColor } from './getRandomColor'
import { tableSchema } from './table-schema'

const database = new Database({
  version: 1,
  name: 'PenxDB',
  // indexedDB: isServer ? undefined : window.indexedDB,
  tables: tableSchema,
})

class DB {
  database = database

  get space() {
    return database.useModel<ISpace>('space')
  }

  get node() {
    return database.useModel<INode>('node')
  }

  get file() {
    return database.useModel<IFile>('file')
  }

  get extension() {
    return database.useModel<IExtension>('extension')
  }

  init = async () => {
    let space: ISpace | undefined = undefined
    const count = await this.space.count()
    if (count === 0) {
      await this.createSpace(
        {
          id: PENX_101,
          name: 'PenX 101',
        },
        false,
      )

      space = await this.createSpace({ name: 'My Space' })
    }
    if (!space) {
      space = (await this.space.selectAll())[0]
    }

    return space!
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
    const spaceId = newSpace.id
    const space = await this.space.insert(newSpace)

    if (initNode) {
      // init space root node
      await this.node.insert(
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
      await this.node.insert(
        getNewNode({
          spaceId,
          type: NodeType.TRASH,
        }),
      )

      // init favorite node
      await this.node.insert(
        getNewNode({
          spaceId,
          type: NodeType.FAVORITE,
        }),
      )

      // init database root node
      await this.node.insert(
        getNewNode({
          spaceId,
          type: NodeType.DATABASE_ROOT,
        }),
      )

      // init daily root node
      const dailyRoot = await this.node.insert(
        getNewNode({
          spaceId,
          type: NodeType.DAILY_ROOT,
        }),
      )

      const todayStr = format(new Date(), 'yyyy-MM-dd')
      const node = await this.createDailyNode(
        getNewNode({
          parentId: dailyRoot.id,
          spaceId,
          type: NodeType.DAILY,
          props: { date: todayStr },
        }),
      )

      await this.updateSpace(spaceId, {
        isActive: true,
        activeNodeIds: [node.id],
      })
    }

    return space as ISpace
  }

  createSpaceByRemote = async (data: Partial<ISpace>) => {
    return await this.space.insert(data)
  }

  selectSpace = async (spaceId: string) => {
    const spaces = await this.listSpaces()

    for (const space of spaces) {
      await this.space.updateByPk(space.id, {
        isActive: false,
      })
    }

    return await this.space.updateByPk(spaceId, {
      isActive: true,
    })
  }

  listSpaces = () => {
    return this.space.selectAll()
  }

  getSpace = (spaceId: string) => {
    return this.space.selectByPk(spaceId) as any as Promise<ISpace>
  }

  getActiveSpace = async () => {
    const spaces = await this.listSpaces()
    const space = spaces.find((space) => space.isActive)
    return space!
  }

  updateSpace = (spaceId: string, space: Partial<ISpace>) => {
    return this.space.updateByPk(spaceId, space)
  }

  deleteSpace = async (spaceId: string) => {
    const nodes = await this.listNodesBySpaceId(spaceId)
    for (const node of nodes) {
      await this.deleteNode(node.id)
    }
    await this.space.deleteByPk(spaceId)
    const spaces = await this.listSpaces()
    if (spaces.length) {
      await this.updateSpace(spaces?.[0]?.id!, { isActive: true })
    }
  }

  getNode = <T = INode>(nodeId: string) => {
    return this.node.selectByPk(nodeId) as any as Promise<T>
  }

  getRootNode = async (spaceId: string) => {
    let nodes = await this.node.selectByIndexAll('type', NodeType.ROOT)
    return nodes.find((node) => node.spaceId === spaceId)!
  }

  getDatabaseRootNode = async (spaceId: string) => {
    let nodes = await this.node.selectByIndexAll('type', NodeType.DATABASE_ROOT)
    return nodes.find((node) => node.spaceId === spaceId)!
  }

  getDailyRootNode = async (spaceId: string) => {
    let nodes = await this.node.selectByIndexAll('type', NodeType.DAILY_ROOT)
    return nodes.find((node) => node.spaceId === spaceId)!
  }

  getInboxNode = async (spaceId: string) => {
    let nodes = await this.node.selectByIndexAll('type', NodeType.INBOX)
    return nodes.find((node) => node.spaceId === spaceId)!
  }

  getTrashNode = async (spaceId: string) => {
    let nodes = await this.node.selectByIndexAll('type', NodeType.TRASH)
    return nodes.find((node) => node.spaceId === spaceId)!
  }

  getTodayNode = async (spaceId: string) => {
    let nodes = await this.node.selectByIndexAll('type', NodeType.DAILY)

    return nodes.find(
      (node) =>
        node.props.date === format(new Date(), 'yyyy-MM-dd') &&
        node.spaceId === spaceId,
    )!
  }

  getFavoriteNode = async (spaceId: string) => {
    let nodes = await this.node.selectByIndexAll('type', NodeType.FAVORITE)
    return nodes.find((node) => node.spaceId === spaceId)!
  }

  updateNode = async <T = INode>(nodeId: string, data: Partial<T>) => {
    const newNode = await this.node.updateByPk(nodeId, {
      ...data,
      updatedAt: new Date(),
    })

    return newNode
  }

  updateNodeProps = async (nodeId: string, props: Partial<INode['props']>) => {
    const newNode = await this.node.updateByPk(nodeId, {
      props,
    })

    return newNode
  }

  deleteNode = async (nodeId: string) => {
    return this.node.deleteByPk(nodeId)
  }

  getSpaceNode = async (spaceId: string) => {
    const spaceNodes = await db.node.selectByIndexAll('type', NodeType.ROOT)
    const spaceNode = spaceNodes.find((node) => node.spaceId === spaceId)
    return spaceNode!
  }

  createPageNode = async (node: Partial<INode>, space: ISpace) => {
    const { spaceId = '' } = node

    const subNode = await this.node.insert(getNewNode({ spaceId }))

    const newNode = await this.node.insert({
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
    const subNode = await this.node.insert(getNewNode({ spaceId }))

    const dailyNode = await this.node.insert({
      ...getNewNode({ spaceId: node.spaceId!, type: NodeType.DAILY }),
      ...node,
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

    const dailyRootNode = await this.getDailyRootNode(spaceId)

    if (!todayNode) {
      todayNode = await this.createNode({
        ...getNewNode({ spaceId, type: NodeType.DAILY }),
      })

      await this.updateNode(dailyRootNode.id, {
        children: [...(dailyRootNode.children || []), todayNode.id],
      })
    }

    return todayNode
  }

  createInboxNode = async (spaceId: string) => {
    const subNode = await this.node.insert(getNewNode({ spaceId }))

    const inboxNode = await this.node.insert({
      ...getNewNode({ spaceId, type: NodeType.INBOX }),
      children: [subNode.id],
    })

    return inboxNode
  }

  createNode = async <T extends INode>(
    node: Partial<T> & { spaceId: string },
  ): Promise<T> => {
    const newNode = await this.node.insert({
      ...getNewNode({ spaceId: node.spaceId! }),
      ...node,
    })

    return newNode as T
  }

  createTextNode = async (spaceId: string, text: string) => {
    const newNode = await this.node.insert({
      ...getNewNode({ spaceId }, text),
    })

    return newNode
  }

  addTextToToday = async (spaceId: string, text: string) => {
    const todayNode = await this.getTodayNode(spaceId)

    const newNode = await this.node.insert({
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

  listNodesBySpaceId = async (spaceId: string) => {
    return this.node.select({
      where: { spaceId },
    })
  }

  listNodesByIds = (nodeIds: string[]) => {
    const promises = nodeIds.map((id) => this.node.selectByPk(id))
    return Promise.all(promises) as any as Promise<INode[]>
  }

  deleteNodeByIds = (nodeIds: string[]) => {
    const promises = nodeIds.map((id) => this.node.deleteByPk(id))
    return Promise.all(promises)
  }

  createExtension(extension: IExtension) {
    return this.extension.insert(extension)
  }

  getExtension = (extensionId: string) => {
    return this.extension.selectByPk(extensionId)
  }

  updateExtension = (extensionId: string, plugin: Partial<IExtension>) => {
    return this.extension.updateByPk(extensionId, plugin)
  }

  installExtension = async (extension: Partial<IExtension>) => {
    const list = await this.extension.select({
      where: {
        spaceId: extension.spaceId!,
        slug: extension.slug!,
      },
    })

    if (list?.length) {
      const ext = list[0]!
      return this.extension.updateByPk(ext.id, {
        ...ext,
        ...extension,
      })
    }

    return this.extension.insert({
      id: uniqueId(),
      ...extension,
    })
  }

  listExtensions = async () => {
    return (await this.extension.selectAll()) as IExtension[]
  }

  createFile(file: Partial<IFile>) {
    return this.file.insert({
      id: uniqueId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...file,
    })
  }

  getFile = (id: string) => {
    return this.file.selectByPk(id)
  }

  updateFile = async (fileId: string, data: Partial<IFile>) => {
    const newNode = await this.file.updateByPk(fileId, {
      ...data,
      updatedAt: new Date(),
    })

    return newNode
  }

  createDatabase = async (name: string, shouldInitCell = false) => {
    // const { id = '' } = data
    const space = await this.getActiveSpace()
    const databaseRootNode = await this.getDatabaseRootNode(space.id)

    const database = await this.createNode<IDatabaseNode>({
      // id,
      parentId: databaseRootNode.id,
      spaceId: space.id,
      type: NodeType.DATABASE,
      props: {
        color: getRandomColor(),
        name,
      },
    })

    await this.updateNode(databaseRootNode.id, {
      children: [...(databaseRootNode.children || []), database.id],
    })

    const columns = await this.initColumns(space.id, database.id)

    const viewColumns: ViewColumn[] = columns.map((column) => ({
      id: column.id,
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
        columns: viewColumns,
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
        columns: viewColumns,
      },
    })

    if (shouldInitCell) {
      const rows = await this.initRows(space.id, database.id)
      await this.initCells(space.id, database.id, columns, rows)
    }
    return database
  }

  initColumns = async (spaceId: string, databaseId: string) => {
    const mainColumn = await this.createNode<IColumnNode>({
      spaceId,
      parentId: databaseId,
      databaseId,
      type: NodeType.COLUMN,
      props: {
        name: 'Note',
        description: '',
        fieldType: FieldType.TEXT,
        isPrimary: true,
        config: {},
      },
    })
    const column2 = await this.createNode<IColumnNode>({
      spaceId,
      databaseId,
      parentId: databaseId,
      type: NodeType.COLUMN,
      props: {
        name: 'Description',
        description: '',
        fieldType: FieldType.TEXT,
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
        props: {},
      }),
      this.createNode<IRowNode>({
        spaceId,
        parentId: databaseId,
        type: NodeType.ROW,
        databaseId,
        props: {},
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
    const columns = await this.node.select({
      where: {
        type: NodeType.COLUMN,
        spaceId: space.id,
        databaseId: id,
      },
      sortBy: 'createdAt',
      orderByDESC: false,
    })

    const rows = await this.node.select({
      where: {
        type: NodeType.ROW,
        spaceId: space.id,
        databaseId: id,
      },
      sortBy: 'createdAt',
      orderByDESC: false,
    })

    const views = await this.node.select({
      where: {
        type: NodeType.VIEW,
        spaceId: space.id,
        databaseId: id,
      },

      sortBy: 'createdAt',
      orderByDESC: false,
    })

    const cells = await this.node.select({
      where: {
        type: NodeType.CELL,
        spaceId: space.id,
        databaseId: id,
      },
    })

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
    const nodes = await this.node.select({
      where: {
        type: NodeType.DATABASE,
        spaceId: space.id,
      },
    })

    const database = nodes.find((node) => node.props.name === name)
    return database!
  }

  addView = async (databaseId: string, viewType: ViewType) => {
    const database = await this.getNode(databaseId)

    const columns = await this.node.select({
      where: {
        type: NodeType.COLUMN,
        spaceId: database.spaceId,
        databaseId,
      },
      sortBy: 'createdAt',
      orderByDESC: false,
    })

    const viewColumns: ViewColumn[] = columns.map((column) => ({
      id: column.id,
      width: 160,
      visible: true,
    }))

    const view = await this.createNode<IViewNode>({
      spaceId: database.spaceId,
      databaseId: database.id,
      parentId: database.id,
      type: NodeType.VIEW,
      children: columns.map((column) => column.id),
      props: {
        name: viewType.toLowerCase(),
        viewType: viewType,
        columns: viewColumns,
      },
    })
    return view
  }

  addColumn = async (databaseId: string, fieldType: FieldType) => {
    const nameMap: Record<FieldType, string> = {
      [FieldType.TEXT]: 'Text',
      [FieldType.NUMBER]: 'Number',
      [FieldType.PASSWORD]: 'Password',
      [FieldType.SINGLE_SELECT]: 'Single Select',
      [FieldType.MULTIPLE_SELECT]: 'Multiple Select',
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
        name: nameMap[fieldType],
        description: '',
        fieldType,
        isPrimary: false,
        config: {},
      },
    })

    const views = await this.node.select({
      where: {
        type: NodeType.VIEW,
        spaceId: space.id,
        databaseId: databaseId,
      },
    })

    for (const view of views) {
      await this.node.updateByPk(view.id, {
        props: {
          ...view.props,
          columns: [
            ...view.props.columns,
            {
              id: column.id,
              width: 160,
              visible: true,
            },
          ],
        },
      } as IViewNode)
    }

    const rows = await this.node.select({
      where: {
        type: NodeType.ROW,
        spaceId,
        databaseId,
      },
    })

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
  }

  addRow = async (databaseId: string, ref = '') => {
    const space = await this.getActiveSpace()
    const spaceId = space.id

    const row = await this.createNode<IRowNode>({
      spaceId,
      databaseId,
      parentId: databaseId,
      type: NodeType.ROW,
      props: {},
    })

    const views = (await this.node.select({
      where: {
        type: NodeType.VIEW,
        spaceId: space.id,
        databaseId,
      },
    })) as IViewNode[]

    // TODO: too hack, should pass a view id to find a view
    const view = views.find((node) => node.props.viewType === ViewType.TABLE)!

    const columns = await this.node.select({
      where: {
        type: NodeType.COLUMN,
        spaceId,
        databaseId,
      },
    })

    const sortedColumns = view.props.columns.map(({ id }) => {
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
          data: '',
        },
      }),
    )

    await Promise.all(promises)
  }

  createTagRow = async (name: string, ref = '') => {
    const space = await this.getActiveSpace()
    const databases = await this.node.select({
      where: { type: NodeType.DATABASE, spaceId: space.id },
    })

    const database = databases.find((db) => db.props.name === name)
    if (!database) return

    // Get all database cells
    const cells = await this.node.select({
      where: {
        type: NodeType.CELL,
        spaceId: space.id,
        databaseId: database.id,
      },
    })

    // check cell is existed
    const cell = cells.find((cell) => cell.props.ref === ref)

    if (!cell) {
      await this.addRow(database.id, ref)
    }
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
    const cells = await this.node.select({
      where: {
        type: NodeType.CELL,
        databaseId,
      },
    })

    for (const cell of cells) {
      if (cell.props.columnId !== columnId) continue
      await this.deleteNode(cell.id)
    }

    const views = (await this.node.select({
      where: {
        type: NodeType.VIEW,
        databaseId: databaseId,
      },
    })) as IViewNode[]

    for (const view of views) {
      await this.updateNode<IViewNode>(view.id, {
        props: {
          ...view.props,
          columns: view.props.columns.filter(({ id }) => id !== columnId),
        },
      })
    }

    await this.deleteNode(columnId)
  }

  deleteRow = async (databaseId: string, rowId: string) => {
    const cells = await this.node.select({
      where: {
        type: NodeType.CELL,
        databaseId,
      },
    })

    for (const cell of cells) {
      if (cell.props.rowId !== rowId) continue
      await this.deleteNode(cell.id)
    }

    await this.deleteNode(rowId)
  }

  updateColumnName = async (columnId: string, name: string) => {
    const column = await this.getNode(columnId)
    await this.updateNode(columnId, {
      props: { ...column.props, name },
    })
  }

  deleteView = async (viewId: string) => {
    await this.deleteNode(viewId)
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
    const viewColumns = view.props.columns
    const index = viewColumns.findIndex((column) => column.id === columnId)
    viewColumns[index] = { ...viewColumns[index], ...props } as ViewColumn

    await this.updateNode<IViewNode>(viewId, {
      props: { ...view.props, columns: viewColumns },
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

      const cells = await this.node.select({
        where: {
          type: NodeType.CELL,
          databaseId: column.databaseId!,
        },
      })

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
    const views = (await this.node.select({
      where: {
        type: NodeType.VIEW,
        databaseId: databaseId,
      },
    })) as IViewNode[]

    const view = views.find((node) => node.id === viewId)!

    const columns = await this.node.select({
      where: {
        type: NodeType.COLUMN,
        databaseId,
      },
    })

    if (!columns[fromIndex] || !columns[toIndex]) return

    await this.updateNode<IViewNode>(view.id, {
      props: {
        ...view.props,
        columns: arrayMoveImmutable(view.props.columns, fromIndex, toIndex),
      },
    })
  }
}

export const db = new DB()
