import { TODO_DATABASE_NAME } from '@penx/constants'
import { extractTags } from '@penx/editor-common'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { ICellNode, INode, isCellNode, NodeType } from '@penx/model-types'
import { getActiveSpaceId } from '@penx/storage'

const specialNodeTypes = [
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
]

export class NodeCleaner {
  //  nodeMap = new Map<string, INode>()

  private isRefCell(item: INode): item is ICellNode {
    return isCellNode(item) && !!item.props.ref
  }

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
      if (this.isRefCell(item)) {
        const databaseNodeRaw = nodeMap.get(item.databaseId!)
        if (!databaseNodeRaw) continue

        const databaseNode = new Node(databaseNodeRaw)

        const nodeRaw = nodeMap.get(item.props.ref)

        // ref id is not empty, but ref node not exist, clean it
        if (!nodeRaw) {
          console.log('Clean invalid row...')
          await db.deleteRow(databaseNode.id, item.props.rowId, true)
          continue
        }

        const node = new Node(nodeRaw)
        if (databaseNode.isTodoDatabase) {
          const shouldClean = !nodeRaw || !node.isTodoElement

          if (shouldClean) {
            console.log('Clean todo row...', item)
            await db.deleteRow(databaseNode.id, item.props.rowId)
          }
          continue
        }

        /** clean tag node */
        const tags = extractTags(node?.element)
        if (!tags.includes(databaseNode.tagName)) {
          const rowId = item.props.rowId
          const cells = nodes.filter(
            (n) => isCellNode(n) && n.props.rowId === rowId,
          ) as ICellNode[]

          // console.log('========tags:', tags)
          const isAllEmpty = cells.every((n) => !n.props.data)

          if (isAllEmpty) {
            console.log('clean tag row...')
            const shouldDeleteRef = tags.length === 0

            await db.deleteRow(
              databaseNode.id,
              item.props.rowId,
              shouldDeleteRef,
            )
          }
        }
      }

      // TODO: need improvement
      if (specialNodeTypes.includes(item.type)) {
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
