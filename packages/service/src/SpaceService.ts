import _ from 'lodash'
import { db } from '@penx/local-db'
import { Node, Space } from '@penx/model'
import { spacesAtom, store } from '@penx/store'
import { INode } from '@penx/types'
import { NodeListService } from './NodeListService'

export class SpaceService {
  constructor(private space: Space) {}

  nodeMap = new Map<string, INode>()

  nodes: INode[] = []

  createSpace = async (name: string) => {
    const space = await store.createSpace({ name })
    return space
  }

  selectSpace = async (id: string) => {
    store.selectSpace(id)
  }

  loadSpaces = async () => {
    const spaces = await db.listSpaces()
    store.set(spacesAtom, spaces)
  }

  // TODO: need to handle rootNode, inboxNode, trashNode
  /**
   * split nodes[] to page[], so we can store it github
   * node[]
   * ->
   * {
   *   rootNode: node[]
   *   inboxNode: node[]
   *   trashNode: node[]
   *   pageNode1: node[] // pageNode from rootNode'children
   *   pageNode2: node[]
   *   pageNode2: node[]
   * }
   * @returns
   */
  getPages = async (): Promise<INode[][]> => {
    const nodes = await db.listNodesBySpaceId(this.space.id)

    for (const node of nodes) {
      this.nodeMap.set(node.id, node)
    }

    const nodeList = new NodeListService(nodes)

    const pages = nodeList.rootNode.children.map((id) => {
      const pageNode = this.nodeMap.get(id)!
      const pageNodes = this.getPageNodesFromOneNode(pageNode)
      return pageNodes
    })

    // space's rootNode
    pages.push([nodeList.rootNode.raw])

    pages.push(this.getPageNodesFromOneNode(nodeList.inboxNode.raw))

    pages.push(this.getPageNodesFromOneNode(nodeList.trashNode.raw))

    return pages
  }

  private getPageNodesFromOneNode = (node: INode) => {
    let pageNodes: INode[] = [node]

    const loop = (children: string[] = []) => {
      for (const id of children) {
        const node = this.nodeMap.get(id)!
        pageNodes.push(node)
        if (node.children?.length) loop(node.children)
      }
    }
    loop(node.children)
    return pageNodes
  }
}
