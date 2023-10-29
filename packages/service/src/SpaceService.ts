import _ from 'lodash'
import { db } from '@penx/local-db'
import { Space } from '@penx/model'
import { INode, NodeType } from '@penx/types'
import { NodeListService } from './NodeListService'

export class SpaceService {
  constructor(
    private space: Space,
    private nodes: INode[],
  ) {}

  nodeMap = new Map<string, INode>()

  // TODO: need to handle rootNode, inboxNode, trashNode
  /**
   * split nodes[] to pageMap, so we can store it github
   * node[]
   * ->
   * {
   *   root: node[]
   *   inbox: node[]
   *   trash: node[]
   *   page1: node[] // pageNode from rootNode'children
   *   page2: node[]
   *   page2: node[]
   * }
   * @returns
   */
  getPageMap = async () => {
    const { nodes } = this
    let pageMap: Record<string, INode[]> = {}

    for (const node of nodes) {
      this.nodeMap.set(node.id, node)
    }

    const nodeList = new NodeListService(nodes)

    // common nodes page
    for (const id of nodeList.rootNode.children) {
      const pageNode = this.nodeMap.get(id)!
      const pageNodes = this.getPageNodesFromOneNode(pageNode)
      pageMap[id] = pageNodes
    }

    // space's rootNode
    pageMap[NodeType.ROOT] = [nodeList.rootNode.raw]

    pageMap[NodeType.INBOX] = this.getPageNodesFromOneNode(
      nodeList.inboxNode.raw,
    )

    pageMap[NodeType.TRASH] = this.getPageNodesFromOneNode(
      nodeList.trashNode.raw,
    )
    return pageMap
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
