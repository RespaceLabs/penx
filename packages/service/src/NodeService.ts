import _ from 'lodash'
import { db } from '@penx/local-db'
import { Node, Page } from '@penx/model'

export class NodeService {
  constructor(private node: Node) {}

  addChild = async (nodeId: string) => {
    const node = await db.getNode(this.node.id)
    const children = node.children || []

    const set = new Set(children)
    set.add(nodeId)

    return db.updateNode(this.node.id, {
      children: [...set],
    })
  }
}
