'use client'

import isEqual from 'react-fast-compare'
import {
  EditorMode,
  ELEMENT_TODO,
  isServer,
  TODO_DATABASE_NAME,
} from '@/lib/constants'
import { ArraySorter, db } from '@/lib/local-db'
import {
  ICellNode,
  IColumnNode,
  IDailyRootNode,
  IDatabaseNode,
  IDatabaseRootNode,
  INode,
  IObjectNode,
  IOptionNode,
  IRootNode,
  IRowNode,
  IViewNode,
  Node,
  NodeType,
  ObjectType,
  ViewType,
} from '@/lib/model'
import { format } from 'date-fns'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { StoreType } from '../store-types'

type FindOptions<T = INode> = {
  where?: Partial<T>
  limit?: number
  orderByDESC?: boolean
  sortBy?: keyof T
}

export type TodoRecord = {
  row: IRowNode
  sourceNode: Node
  todoNode: Node
}

export function getLocalActiveNode() {
  if (isServer) return []
  const activeNode = window.localStorage.getItem('ACTIVE_NODE')
  if (!activeNode) return undefined
  try {
    return JSON.parse(activeNode)
  } catch (error) {
    return undefined
  }
}

export const nodesAtom = atom<INode[]>([])

export const activeNodeAtom = atom<INode>(getLocalActiveNode() as any as INode)

export class NodeStore {
  constructor(private store: StoreType) {}

  getNodes() {
    return this.store.get(nodesAtom)
  }

  setNodes(nodes: INode[]) {
    return this.store.set(nodesAtom, nodes)
  }

  getNode(id: string) {
    const nodes = this.getNodes()
    return nodes.find((node) => node.id === id)!
  }

  getTodayNode = () => {
    let nodes = this.getNodes()
    return nodes.find((node) => node.date === format(new Date(), 'yyyy-MM-dd'))!
  }

  getRootNode = () => {
    let nodes = this.getNodes()
    const node = nodes.find((node) => node.type === NodeType.ROOT)!
    return node as IRootNode
  }

  getDailyRootNode = () => {
    let nodes = this.getNodes()
    const node = nodes.find((node) => node.type === NodeType.DAILY_ROOT)!
    return node as IDailyRootNode
  }

  getDatabaseRootNode = () => {
    const nodes = this.getNodes()
    return nodes.find(
      (node) => node.type === NodeType.DATABASE_ROOT,
    ) as IDatabaseRootNode
  }

  getDatabaseNodes = () => {
    const node = this.getDatabaseRootNode()
    if (!node?.children) return []
    return node.children.map((id) => this.getNode(id) as IDatabaseNode)
  }

  getDatabaseByName(tagName: string) {
    const nodes = this.getNodes()

    let databaseNode = nodes.find(
      (node) => node.type === NodeType.DATABASE && node.props.name === tagName,
    )

    return databaseNode
  }

  getDatabase(id: string) {
    const database = this.getNode(id) as IDatabaseNode
    const columns = this.find({
      where: {
        type: NodeType.COLUMN,
        databaseId: id,
      },
    }) as IColumnNode[]

    const rows = this.find({
      where: {
        type: NodeType.ROW,
        databaseId: id,
      },
      sortBy: 'createdAt',
      orderByDESC: false,
    }) as IRowNode[]

    const views = (
      this.find({
        where: {
          type: NodeType.VIEW,
          databaseId: id,
        },
      }) as IViewNode[]
    ).sort((a, b) => (a.props.viewType === ViewType.TABLE ? -1 : 1))

    const cells = this.find({
      where: {
        type: NodeType.CELL,
        databaseId: id,
      },
    }) as ICellNode[]

    const options = this.find({
      where: {
        type: NodeType.OPTION,
        databaseId: id,
      },
    }) as IOptionNode[]

    return {
      database,
      views,
      columns,
      rows,
      cells,
      options,
    }
  }

  getCells(databaseId: string) {
    const nodes = this.getNodes()
    let cells = nodes.filter(
      (node) => node.type === NodeType.CELL && node.parentId === databaseId,
    )
    return cells
  }

  getTodos() {
    let records: TodoRecord[] = []

    const todo = this.getDatabaseByName(TODO_DATABASE_NAME)
    if (!todo) return []

    const database = this.getDatabase(todo.id)

    for (const row of database.rows) {
      const rowCells = database.cells.filter((c) => c.props.rowId === row.id)!

      const sourceCell = rowCells.find((c) => c.props.data?.isTodoSource)

      if (!sourceCell) continue

      const sourceNode = this.getNode(sourceCell.props.data?.sourceId || '')

      if (!sourceNode) continue

      const todoCell = rowCells.find((c) => !!c.props.ref)

      if (!todoCell) continue

      const todoNode = this.getNode(todoCell.props.ref)

      if (!todoNode) continue

      records.push({
        row,
        sourceNode: new Node(sourceNode),
        todoNode: new Node(todoNode),
      })
    }
    return records
  }

  async selectNode(node: INode, index = 0, shouldCompare = true) {
    if (!this.store.router.isNode()) this.store.router.toNode()

    const activeNode = this.store.get(activeNodeAtom)

    if (
      shouldCompare &&
      index === 0 &&
      isEqual(activeNode, node) &&
      this.store.router.isNode()
    ) {
      console.log('is equal node')
      return
    }
  }

  async selectInbox() {}

  async selectTagBox() {}

  async selectTrash() {}

  async selectSpaceNode(userId: string) {
    let node = await db.getRootNode(userId)
    this.selectNode(node)
    return node
  }

  async updateNode(id: string, data: Partial<INode>) {
    await db.updateNode(id, data)
    const nodes = await db.listNodesByUserId()
    this.setNodes(nodes)
  }

  async deleteNode(id: string) {
    const node = this.store.node.getNode(id)
    await db.deleteNode(id)
    console.log('===========node.parentId:', node.parentId)

    if (node.parentId) {
      // update parentNode children
      const parentNode = this.store.node.getNode(node.parentId)
      await db.updateNode(node.parentId, {
        children: parentNode.children.filter(
          (childId) => childId !== id && this.store.node.getNode(childId),
        ),
      })
    }

    const nodes = await db.listNodesByUserId()
    this.setNodes(nodes)
  }

  async addTodo(text: string, isInTodoPage = false) {}

  async openInNewPanel(nodeId: string) {}

  async closePanel(index: number) {}

  async selectDailyNote(date: Date = new Date(), isSelectNode = true) {
    const dateStr = format(date, 'yyyy-MM-dd')

    const userId = window.__USER_ID__
    const newNodes = await db.listNodesByUserId(userId)

    let dateNode = newNodes.find(
      (node) => node.type === NodeType.DAILY && node.date === dateStr,
    )

    if (!dateNode) {
      dateNode = await db.createDailyNode({
        userId,
        date: dateStr,
      })
    }

    this.setNodes(newNodes)
    if (isSelectNode) {
      this.selectNode(dateNode)
    }
    return dateNode
  }

  async addTextToToday(text: string) {}

  async addNodesToToday(nodes: INode[]) {}

  async createPageNode(input: Partial<IObjectNode> = {}) {
    const userId = window.__USER_ID__
    const node = await db.createPageNode(
      {
        collapsed: true,
        ...input,
        props: {
          objectType: ObjectType.ARTICLE,
        },
        type: NodeType.OBJECT,
      },
      userId,
    )

    const nodes = await db.listNodesByUserId(userId)

    this.setNodes(nodes)
    return node
  }

  async createDatabase(
    spaceId: string,
    name: string,
    shouldInitCells = false,
  ) {}

  find(options: FindOptions = {}): INode[] {
    const data = this.getNodes()
    let result: INode[] = []

    // handle where
    if (Reflect.has(options, 'where') && options.where) {
      const whereKeys = Object.keys(options.where)

      result = data.filter((item) => {
        const dataKeys = Object.keys(item)

        const every = whereKeys.every((key) => {
          return (
            dataKeys.includes(key) &&
            (item as any)[key] === (options.where as any)[key]
          )
        })

        return every
      })

      // handle sortBy
      if (Reflect.has(options, 'sortBy') && options.sortBy) {
        // sort data
        result = new ArraySorter<INode>(result).sortBy({
          desc: Reflect.has(options, 'orderByDESC') && options.orderByDESC,
          keys: [options.sortBy as string],
        })
      }

      if (Reflect.has(options, 'limit') && options.limit) {
        // slice data
        result = result.slice(0, +options.limit)
      }
    }

    return result
  }
}
