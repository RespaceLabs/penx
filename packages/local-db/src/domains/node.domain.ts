import { Table } from 'dexie'
import {
  IDailyRootNode,
  INode,
  IRootNode,
  ISpace,
  NodeType,
} from '@penx/model-types'
import { formatToDate } from '../libs/formatToDate'
import { getCommonNode } from '../libs/getCommonNode'
import { getNewNode } from '../libs/getNewNode'
import { penxDB } from '../penx-db'

export class NodeDomain {
  constructor(private node: Table<INode, string>) {}

  listNodesBySpaceId = (spaceId: string) => {
    return this.node.where({ spaceId }).toArray()
  }

  listNodesByIds = (nodeIds: string[]) => {
    return this.node.where('id').anyOf(nodeIds).toArray()
  }

  deleteNodeByIds = (nodeIds: string[]) => {
    return this.node.where('id').anyOf(nodeIds).delete()
  }

  createInboxNode = async (spaceId: string) => {
    const subNode = await this.createNode(getCommonNode({ spaceId }))

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
      ...getCommonNode({ spaceId: node.spaceId! }),
      ...node,
    })

    return this.node.get(newNodeId) as any as Promise<T>
  }

  createTextNode = async (spaceId: string, text: string) => {
    const newNode = await this.createNode({
      ...getCommonNode({ spaceId }, text),
    })

    return newNode
  }

  addTextToToday = async (spaceId: string, text: string) => {
    const todayNode = await this.getOrCreateTodayNode(spaceId)

    const newNode = await this.createNode({
      ...getCommonNode({ spaceId }, text),
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

  getNodeByDate = async (spaceId: string, date = formatToDate(new Date())) => {
    let nodes = await this.node
      .where({ type: NodeType.DAILY, spaceId })
      .toArray()

    return nodes.find((node) => node.date === date)!
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
    const node = await this.getNode(nodeId)
    const newProps = { ...node.props, ...props }
    await this.node.update(nodeId, {
      props: newProps,
    })
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

    const subNode = await this.createNode(getCommonNode({ spaceId }))

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

    const existDailyNode = await this.getNodeByDate(spaceId, node.date)

    // exist daily node, no need to create
    if (existDailyNode) return existDailyNode

    const dailyRootNode = await this.getDailyRootNode(spaceId)

    const subNode = await this.createNode(getCommonNode({ spaceId }))

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

    const dailyRootChildren = [...(dailyRootNode.children || []), dailyNode.id]

    await this.updateNode(dailyRootNode.id, {
      children: dailyRootChildren,
    })

    return dailyNode
  }

  getOrCreateTodayNode = async (spaceId: string) => {
    let todayNode = await this.getNodeByDate(spaceId)

    if (!todayNode) {
      todayNode = await this.createDailyNode({
        spaceId,
        date: formatToDate(new Date()),
      })
    }

    return todayNode
  }
}

export const nodeDomain = new NodeDomain(penxDB.node)
