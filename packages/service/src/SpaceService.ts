import _ from 'lodash'
import { db } from '@penx/local-db'
import { Space } from '@penx/model'
import { INode, NodeType } from '@penx/model-types'
import { NodeListService } from './NodeListService'

export class SpaceService {
  constructor(
    private space: Space,
    private nodes: INode[],
  ) {}

  nodeMap = new Map<string, INode>()

  /**
   * split nodes[] to pageMap, so we can store it github
   * node[]
   * ->
   * {
   *   ROOT: node[]
   *   INBOX: node[]
   *   TRASH: node[]
   *   FAVORITE: node[]
   *   DATABASE_ROOT: node[]
   *
   *   page1: node[] // pageNode from rootNode'children
   *   page2: node[]
   *   page2: node[]
   *
   *   database1: node[] // databaseNode from databaseRootNode'children
   *   database2: node[]
   *   database3: node[]
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

    // common database nodes
    for (const id of nodeList.databaseRootNode.children) {
      const databaseNode = this.nodeMap.get(id)!
      const pageNodes = this.nodes.filter((n) => n.parentId === databaseNode.id)
      pageMap[id] = [databaseNode, ...pageNodes]
    }

    // space's rootNode
    pageMap[NodeType.ROOT] = [nodeList.rootNode.raw]

    // database's rootNode
    pageMap[NodeType.DATABASE_ROOT] = [nodeList.databaseRootNode.raw]

    // favorite node
    pageMap[NodeType.FAVORITE] = [nodeList.favoriteNode.raw]

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
