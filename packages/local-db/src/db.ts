import { nanoid } from 'nanoid'
import { Database } from '@penx/indexeddb'
import { Node, Space } from '@penx/model'
import {
  FieldType,
  ICellNode,
  IColumnNode,
  IDatabaseNode,
  IExtension,
  IFile,
  INode,
  IRowNode,
  ISpace,
  IViewNode,
  NodeType,
  ViewType,
} from '@penx/types'
import { getNewNode } from './getNewNode'
import { getNewSpace } from './getNewSpace'
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
    const count = await this.space.count()
    if (count === 0) {
      const space = await this.createSpace({ name: 'My Space' })
    }
    // const space = await this.space.toCollection().first()
    const space = (await this.space.selectAll())[0]

    return space!
  }

  createSpace = async (data: Partial<ISpace>, initNode = true) => {
    const spaces = await this.listSpaces()

    for (const space of spaces) {
      await this.space.updateByPk(space.id, {
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

      // init tag root node
      await this.node.insert(
        getNewNode({
          spaceId,
          type: NodeType.TAG_ROOT,
        }),
      )

      const node = getNewNode({ spaceId })

      await this.createPageNode(node, space)

      await this.space.updateByPk(spaceId, {
        isActive: true,
        activeNodeId: node.id,
      })
    }

    return space as ISpace
  }

  selectSpace = async (spaceId: string) => {
    const spaces = await this.listSpaces()

    for (const space of spaces) {
      await this.space.updateByPk(space.id, {
        isActive: false,
      })
    }

    await this.space.updateByPk(spaceId, {
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

  getNode = (nodeId: string) => {
    return this.node.selectByPk(nodeId)
  }

  getInboxNode = async (spaceId: string) => {
    let nodes = await this.node.selectByIndexAll('type', NodeType.INBOX)
    return nodes.find((node) => node.spaceId === spaceId)!
  }

  getTrashNode = async (spaceId: string) => {
    let nodes = await this.node.selectByIndexAll('type', NodeType.TRASH)
    return nodes.find((node) => node.spaceId === spaceId)!
  }

  updateNode = async (nodeId: string, data: Partial<INode>) => {
    const newNode = await this.node.updateByPk(nodeId, {
      ...data,
      updatedAt: Date.now(),
    })

    return newNode
  }

  trashNode = async (nodeId: string) => {
    // TODO:
  }

  restoreNode = async (nodeId: string) => {
    // TODO:
  }

  deleteNode = async (nodeId: string) => {
    const node = await this.getNode(nodeId)
    await this.updateSnapshot(node, 'delete')
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

  listNodesBySpaceId = async (spaceId: string) => {
    return this.node.select({
      where: { spaceId },
    })
  }

  listNormalNodes = async (spaceId: string) => {
    return this.node.select({
      where: { spaceId },
    })
  }

  updateSnapshot = async (
    node: INode,
    action: 'add' | 'delete' | 'update',
    editorValue?: any,
  ) => {
    const spaceRaw = await this.getSpace(node.spaceId)
    const space = new Space(spaceRaw)
    const nodeModel = new Node(node)
    space.snapshot[action](nodeModel.snapshotId, editorValue)

    await this.updateSpace(space.id, {
      snapshot: space.snapshot.toJSON(),
    })
  }

  listTrashedNodes = async (spaceId: string) => {
    // TODO:
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
      id: nanoid(),
      ...extension,
    })
  }

  listExtensions = async () => {
    return (await this.extension.selectAll()) as IExtension[]
  }

  createFile(file: Partial<IFile>) {
    return this.file.insert({
      id: nanoid(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...file,
    })
  }

  getFile = (id: string) => {
    return this.file.selectByPk(id)
  }

  updateFile = async (fileId: string, data: Partial<IFile>) => {
    const newNode = await this.file.updateByPk(fileId, {
      ...data,
      updatedAt: Date.now(),
    })

    return newNode
  }

  createDatabase = async (name: string = '') => {
    // const { id = '' } = data
    const space = await this.getActiveSpace()

    const spaceNode = await this.getSpaceNode(space.id)

    const database = await this.createNode<IDatabaseNode>({
      // id,
      parentId: spaceNode.id,
      spaceId: space.id,
      type: NodeType.DATABASE,
      props: {
        name,
      },
    })

    await this.updateNode(spaceNode.id, {
      children: [...(spaceNode.children || []), database.id],
    })

    // Create view
    const view = await this.createNode<IViewNode>({
      spaceId: space.id,
      databaseId: database.id,
      parentId: database.id,
      type: NodeType.VIEW,
      props: {
        name: 'Table',
        type: ViewType.View,
      },
    })

    const [columns, rows] = await Promise.all([
      this.initColumns(space.id, database.id),
      this.initRows(space.id, database.id),
    ])

    await this.initCells(space.id, database.id, columns, rows)
    return database
  }

  initColumns = async (spaceId: string, databaseId: string) => {
    return Promise.all([
      this.createNode<IColumnNode>({
        spaceId,
        parentId: databaseId,
        databaseId,
        type: NodeType.COLUMN,
        props: {
          name: 'Column 1',
          description: '',
          fieldType: FieldType.Text,
          isPrimary: true,
          width: 120,
          config: {},
        },
      }),
      this.createNode<IColumnNode>({
        spaceId,
        databaseId,
        parentId: databaseId,
        type: NodeType.COLUMN,
        props: {
          name: 'Column 2',
          description: '',
          fieldType: FieldType.Text,
          isPrimary: false,
          config: {},
          width: 120,
        },
      }),
    ])
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
              fieldType: column.props.fieldType,
              options: [],
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

  addColumn = async (databaseId: string, fieldType: FieldType) => {
    const space = await this.getActiveSpace()
    const spaceId = space.id

    const column = await this.createNode<IColumnNode>({
      spaceId,
      databaseId,
      parentId: databaseId,
      type: NodeType.COLUMN,
      props: {
        name: fieldType,
        description: '',
        fieldType,
        isPrimary: false,
        config: {},
        width: 120,
      },
    })

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
          fieldType: column.props.fieldType,
          options: [],
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

    const columns = await this.node.select({
      where: {
        type: NodeType.COLUMN,
        spaceId,
        databaseId,
      },
    })

    const promises = columns.map((column, index) =>
      this.createNode<ICellNode>({
        spaceId,
        databaseId,
        parentId: databaseId,
        type: NodeType.CELL,
        props: {
          columnId: column.id,
          rowId: row.id,
          ref: index === 0 ? ref : '',
          fieldType: column.props.fieldType,
          options: [],
          data: '',
        },
      }),
    )

    await Promise.all(promises)
  }
}

export const db = new DB()
