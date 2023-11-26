import { db } from '@penx/local-db'
import { INode, NodeType } from '@penx/model-types'

export class NodeCleaner {
  async cleanDeletedNodes() {
    const space = await db.getActiveSpace()
    const nodes = await db.listNodesBySpaceId(space.id)

    const nodeMap = new Map<string, INode>()

    for (const node of nodes) {
      nodeMap.set(node.id, node)
    }

    for (const node of nodes) {
      // TODO: need improvement
      if (
        [
          NodeType.ROOT,
          NodeType.DAILY_ROOT,
          NodeType.DATABASE_ROOT,
          NodeType.DATABASE,
          NodeType.COLUMN,
          NodeType.ROW,
          NodeType.VIEW,
          NodeType.CELL,
        ].includes(node.type)
      ) {
        continue
      }

      // if (!Reflect.has(node, 'parentId')) continue
      if (!node.parentId) continue

      const parentNode = nodeMap.get(node.parentId)

      if (!parentNode?.children.includes(node.id)) {
        console.log('=======clear node!!!!', node)
        await db.deleteNode(node.id)
      }
    }
  }
}
