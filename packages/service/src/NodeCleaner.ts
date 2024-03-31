import { TODO_DATABASE_NAME } from '@penx/constants'
import { extractTags } from '@penx/editor-common'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { INode, isCellNode, NodeType } from '@penx/model-types'
import { getActiveSpaceId } from '@penx/storage'

export class NodeCleaner {
  async cleanDeletedNodes(nodes: INode[] = []) {
    const activeSpaceId = await getActiveSpaceId()
    if (!activeSpaceId) return

    const spaces = await db.listSpaces()
    const space = spaces.find((s) => s.id === activeSpaceId)
    if (!space) return

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

        if (databaseNode?.props.name === TODO_DATABASE_NAME) {
          const shouldClean = !node || !new Node(node).isTodoElement
          if (shouldClean) {
            console.log('clean todo row...', databaseNode.props.name)
            await db.deleteRow(databaseNode.id, item.props.rowId)
          }
          continue
        }

        const tags = extractTags(node?.element)

        if (databaseNode && !tags.includes(databaseNode.props.name!)) {
          console.log('clean tag row...', databaseNode.props.name)
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
        console.log('=======clear node!!!!', item, JSON.stringify(item.element))
        await db.deleteNode(item.id)
      }
    }
  }
}
