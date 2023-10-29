import _ from 'lodash'
import { ArraySorter } from '@penx/indexeddb'
import { Node } from '@penx/model'
import { INode, ISpace } from '@penx/types'

type FindOptions<T = INode> = {
  where?: Partial<T>
  limit?: number
  orderByDESC?: boolean
  sortBy?: keyof T
}

export class NodeListService {
  nodes: Node[] = []

  nodeMap = new Map<string, Node>()

  constructor(private rawNodes: INode[] = []) {
    this.nodes = this.rawNodes.map((raw) => new Node(raw))

    for (const node of this.nodes) {
      this.nodeMap.set(node.id, node)
    }
  }

  get rootNode() {
    const rootNode = this.nodes.find((n) => n.isRootNode)!
    return rootNode
  }

  get rootNodes() {
    return this.rootNode.children
      .map((id) => this.nodeMap.get(id)!)
      .sort((a, b) => b.updatedAt - a.updatedAt)
  }

  get normalNodes() {
    return this.nodes.filter((node) => node.isNormal)
  }

  get trashedNodes() {
    return this.nodes.filter((node) => node.isTrashed)
  }

  getFavorites(ids: string[] = []) {
    return this.nodes.filter((node) => ids.includes(node.id))
  }

  // TODO: need to improvement
  find(options: FindOptions = {}): Node[] {
    const data = this.rawNodes
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

    return result.map((raw) => new Node(raw))
  }
}
