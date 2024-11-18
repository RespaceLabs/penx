import { getLocalSession } from '@/lib/local-session'
import {
  IDailyRootNode,
  INode,
  IObjectNode,
  IRootNode,
  NodeType,
} from '@/lib/model'
import { Table } from 'dexie'
import { formatToDate } from '../libs/formatToDate'
import { getCommonNode } from '../libs/getCommonNode'
import { getNewNode } from '../libs/getNewNode'
import { penxDB } from '../penx-db'

async function getUserId() {
  // if (typeof window === 'undefined') return ''
  const session = await getLocalSession()
  // console.log('=====session:', session)
  return session?.userId || ''
}

export class NodeDomain {
  constructor(private node: Table<INode, string>) {}

  listNodesByUserId = async (_userId = '') => {
    const userId = _userId || (await getUserId())
    return this.node.where({ userId }).toArray()
  }

  listNodesByIds = (nodeIds: string[]) => {
    return this.node.where('id').anyOf(nodeIds).toArray()
  }

  deleteNodeByIds = (nodeIds: string[]) => {
    return this.node.where('id').anyOf(nodeIds).delete()
  }

  deleteNodeByUserId = async (_userId = '') => {
    const userId = _userId || (await getUserId())
    return this.node.where({ userId }).delete()
  }

  getLastUpdatedAt = async (): Promise<number> => {
    const nodes = await this.listNodesByUserId()
    if (!nodes.length) return 0

    const at = Math.max(...nodes.map((n) => new Date(n.updatedAt).getTime()))
    return at
  }

  createInboxNode = async (userId: string) => {
    const subNode = await this.createNode(getCommonNode({ userId: userId }))

    const inboxNode = await this.createNode({
      ...getNewNode({ userId, type: NodeType.INBOX }),
      children: [subNode.id],
    })

    return inboxNode
  }

  createNode = async <T extends INode>(
    node: Partial<T> & { userId: string },
  ): Promise<T> => {
    const newNodeId = await this.node.add({
      ...getCommonNode({ userId: node.userId! }),
      ...node,
    })

    return this.node.get(newNodeId) as any as Promise<T>
  }

  createTextNode = async (userId: string, text: string) => {
    const newNode = await this.createNode({
      ...getCommonNode({ userId: userId }, text),
    })

    return newNode
  }

  addTextToToday = async (userId: string, text: string) => {
    const todayNode = await this.getOrCreateTodayNode(userId)

    const newNode = await this.createNode({
      ...getCommonNode({ userId: userId }, text),
    })

    const newTodayNode = await this.updateNode(todayNode.id, {
      children: [...(todayNode.children || []), newNode.id],
    })

    return {
      node: newNode,
      todayNode: newTodayNode,
    }
  }

  addNodesToToday = async (userId: string, nodes: INode[]) => {
    const todayNode = await this.getOrCreateTodayNode(userId)

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

  getNode = <T = INode>(nodeId: string) => {
    return this.node.get(nodeId) as any as Promise<T>
  }

  getRootNode = async (userId: string) => {
    const node = await this.node
      .where({
        type: NodeType.ROOT,
        userId,
      })
      .first()
    return node as IRootNode
  }

  getDailyRootNode = async (userId: string) => {
    const node = await this.node
      .where({
        type: NodeType.DAILY_ROOT,
        userId,
      })
      .first()
    return node as IDailyRootNode
  }

  getInboxNode = async (userId: string) => {
    const node = await this.node
      .where({
        type: NodeType.INBOX,
        userId,
      })
      .first()
    return node as INode
  }

  getTrashNode = async (userId: string) => {
    const node = await this.node
      .where({
        type: NodeType.TRASH,
        userId,
      })
      .first()
    return node as INode
  }

  getNodeByDate = async (userId: string, date = formatToDate(new Date())) => {
    let nodes = await this.node
      .where({ type: NodeType.DAILY, userId })
      .toArray()

    return nodes.find((node) => node.date === date)!
  }

  getFavoriteNode = async (userId: string) => {
    let nodes = await this.node
      .where({
        type: NodeType.FAVORITE,
      })
      .toArray()
    return nodes.find((node) => node.userId === userId)!
  }

  updateNode = async <T extends INode>(nodeId: string, data: Partial<T>) => {
    const newData: any = data || {}
    if (!Reflect.has(data, 'updatedAt')) {
      newData.updatedAt = new Date()
    }

    await this.node.update(nodeId, newData)
    const newNode = (await this.node.get(nodeId)) as any as Promise<T>

    return newNode
  }

  updateNodeProps = async (nodeId: string, props: Partial<INode['props']>) => {
    const node = await this.getNode(nodeId)
    const newProps = { ...node.props, ...props }
    await this.node.update(nodeId, {
      props: newProps,
    })
  }

  deleteNode = async (nodeId: string) => {
    return this.node.delete(nodeId)
  }

  getUserRootNode = async (userId: string) => {
    const userNodes = await this.node.where({ type: NodeType.ROOT }).toArray()
    const spaceNode = userNodes.find((node) => node.userId === userId)
    return spaceNode!
  }

  createPageNode = async (node: Partial<IObjectNode>, userId: string) => {
    const subNode = await this.createNode(getCommonNode({ userId }))
    const rootNode = await this.getUserRootNode(userId)

    const newNode = await this.createNode({
      ...getNewNode({ userId }),
      parentId: rootNode.id,
      ...node,
      children: [subNode.id],
    })

    await this.updateNode(rootNode.id, {
      children: [...(rootNode.children || []), newNode.id],
    })

    return newNode
  }

  createDailyNode = async (node: Partial<INode>) => {
    const { userId: userId = '' } = node

    const existDailyNode = await this.getNodeByDate(userId, node.date)

    // exist daily node, no need to create
    if (existDailyNode) return existDailyNode

    const dailyRootNode = await this.getDailyRootNode(userId)

    const subNode = await this.createNode(getCommonNode({ userId: userId }))

    const dailyNode = await this.createNode({
      ...getNewNode({ userId: node.userId!, type: NodeType.DAILY }),
      ...node,
      parentId: dailyRootNode.id,
      collapsed: true,
      children: [subNode.id],
    })

    await this.updateNode(subNode.id, {
      parentId: dailyNode.id,
    })

    const dailyRootChildren = [...(dailyRootNode.children || []), dailyNode.id]

    await this.updateNode(dailyRootNode.id, {
      children: dailyRootChildren,
    })

    return dailyNode
  }

  getOrCreateTodayNode = async (userId: string) => {
    let todayNode = await this.getNodeByDate(userId)

    if (!todayNode) {
      todayNode = await this.createDailyNode({
        userId,
        date: formatToDate(new Date()),
      })
    }

    return todayNode
  }
}

export const nodeDomain = new NodeDomain(penxDB.node)
