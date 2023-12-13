import { extractTags } from '@penx/editor-common'
import { db } from '@penx/local-db'
import { INode, isCellNode, NodeType } from '@penx/model-types'

export class NodeCleaner {
  async cleanDeletedNodes(nodes: INode[] = []) {
    const space = await db.getActiveSpace()

    if (!nodes.length) {
      nodes = await db.listNodesBySpaceId(space.id)
    }

    const nodeMap = new Map<string, INode>()

    for (const node of nodes) {
      nodeMap.set(node.id, node)
    }

    for (const item of nodes) {
      if (item?.children?.length) {
        // TODO: handle empty or invalid children
      }

      // clean unRefed row
      if (isCellNode(item) && !!item.props.ref) {
        const node = nodeMap.get(item.props.ref)!
        const databaseNode = nodeMap.get(item.databaseId!)

        const tags = extractTags(node?.element)

        if (databaseNode && !tags.includes(databaseNode.props.name!)) {
          console.log('clean row', databaseNode.props.name)
          await db.deleteRow(databaseNode.id, item.props.rowId)
        }
      }

      // TODO: need improvement
      if (
        [
          NodeType.ROOT,

          NodeType.DAILY_ROOT,
          NodeType.DAILY,

          NodeType.DATABASE_ROOT,
          NodeType.DATABASE,

          NodeType.FAVORITE,
          NodeType.TRASH,
          NodeType.INBOX,

          NodeType.COLUMN,
          NodeType.ROW,
          NodeType.VIEW,
          NodeType.CELL,
          NodeType.OPTION,
          NodeType.FILTER,
        ].includes(item.type)
      ) {
        continue
      }

      // if (!Reflect.has(node, 'parentId')) continue
      if (!item.parentId) continue

      const parentNode = nodeMap.get(item.parentId)

      if (!parentNode?.children.includes(item.id)) {
        console.log('=======clear node!!!!', item)
        await db.deleteNode(item.id)
      }
    }
  }
}
