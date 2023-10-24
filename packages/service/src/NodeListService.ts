import _ from 'lodash'
import { Node } from '@penx/model'
import { INode, ISpace } from '@penx/types'

export class NodeListService {
  nodes: Node[] = []

  nodeMap = new Map<string, Node>()

  constructor(
    private space: ISpace,
    private rawNodes: INode[] = [],
  ) {
    this.nodes = this.rawNodes.map((raw) => new Node(raw))

    for (const node of this.nodes) {
      this.nodeMap.set(node.id, node)
    }
  }

  get rootNodes() {
    if (!this.nodes.length) return []
    return this.space.children.map((id) => this.nodeMap.get(id)!)
  }

  get normalNodes() {
    return this.nodes.filter((node) => node.isNormal)
  }

  get trashedDocs() {
    return this.nodes.filter((node) => node.isTrashed)
  }

  getFavorites(ids: string[] = []) {
    return this.nodes.filter((doc) => ids.includes(doc.id))
  }
}
