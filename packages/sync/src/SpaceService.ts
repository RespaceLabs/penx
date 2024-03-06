import _ from 'lodash'
import { calculateSHA256FromString } from '@penx/encryption'
import { Node } from '@penx/model'
import { INode, ISpace, NodeType } from '@penx/model-types'
import { NodeListService } from './NodeListService'

export class SpaceService {
  constructor(
    private nodes: INode[],
    private password: string,
  ) {}

  nodeMap = new Map<string, INode>()

  /**
   *
   * split nodes[] to pageMap, so we can store it github
   * node[]
   * ->
   * {
   *   ROOT: node[]
   *   INBOX: node[]
   *   TRASH: node[]
   *   FAVORITE: node[]
   *   DATABASE_ROOT: node[]
   *   DAILY_ROOT: node[]
   *
   *   page1: node[] // pageNode from rootNode'children
   *   page2: node[]
   *   page2: node[]
   *
   *   daily1: node[] // DailyNode from dailyRootNode'children
   *   daily2: node[]
   *   daily3: node[]
   *
   *   database1: node[] // databaseNode from databaseRootNode'children
   *   database2: node[]
   *   database3: node[]
   * }
   * @returns
   */
  getPageMap = () => {
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
      pageMap[id] = this.toEncryptedNodes(pageNodes)
    }

    // common database nodes
    for (const id of nodeList.databaseRootNode.children) {
      const databaseNode = this.nodeMap.get(id)!
      const pageNodes = this.nodes.filter((n) => n.parentId === databaseNode.id)
      const nodes = [databaseNode, ...pageNodes]
      pageMap[id] = this.toEncryptedNodes(nodes)
    }

    // common daily nodes
    for (const id of nodeList.dailyRootNode.children) {
      const dailyNode = this.nodeMap.get(id)!
      const pageNodes = this.nodes.filter((n) => n.parentId === dailyNode.id)
      const nodes = [dailyNode, ...pageNodes]
      pageMap[id] = this.toEncryptedNodes(nodes)
    }

    // space's rootNode
    pageMap[NodeType.ROOT] = this.toEncryptedNodes([nodeList.rootNode.raw])

    // database's rootNode
    pageMap[NodeType.DATABASE_ROOT] = this.toEncryptedNodes([
      nodeList.databaseRootNode.raw,
    ])

    // daily's rootNode
    pageMap[NodeType.DAILY_ROOT] = this.toEncryptedNodes([
      nodeList.dailyRootNode.raw,
    ])

    // favorite node
    pageMap[NodeType.FAVORITE] = this.toEncryptedNodes([
      nodeList.favoriteNode.raw,
    ])

    pageMap[NodeType.INBOX] = this.toEncryptedNodes(
      this.getPageNodesFromOneNode(nodeList.inboxNode.raw),
    )

    pageMap[NodeType.TRASH] = this.toEncryptedNodes(
      this.getPageNodesFromOneNode(nodeList.trashNode.raw),
    )

    return pageMap
  }

  getPageMapHash() {
    const pageMap = this.getPageMap()

    return Object.keys(pageMap).reduce<Record<string, string>>((acc, key) => {
      const nodes = pageMap[key].map((n) => new Node(n))

      const nodesHashStr = nodes.map((n) => n.toHash()).join('')

      return {
        ...acc,
        // [key]: CryptoJS.MD5(nodesHashStr).toString(),
        [key]: calculateSHA256FromString(nodesHashStr),
      }
    }, {})
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

  private toEncryptedNodes(nodes: INode[]) {
    return nodes.map((node) => {
      return new Node(node).toEncrypted(this.password)
    })
  }
}
