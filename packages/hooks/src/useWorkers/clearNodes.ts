import { db } from '@penx/local-db'
import { sleep } from '@penx/shared'
import { INode } from '@penx/types'

const INTERVAL = 10 * 1000

export async function clearNodes() {
  while (true) {
    await clearDeletedNode()
    await sleep(INTERVAL)
  }
}

async function clearDeletedNode() {
  const space = await db.getActiveSpace()
  const nodes = await db.listNodesBySpaceId(space.id)

  const nodeMap = new Map<string, INode>()

  for (const node of nodes) {
    nodeMap.set(node.id, node)
  }

  for (const node of nodes) {
    // if (!Reflect.has(node, 'parentId')) continue
    if (!node.parentId) continue

    const parentNode = nodeMap.get(node.parentId)

    console.log('start clear....')

    if (!parentNode?.children.includes(node.id)) {
      console.log('clear..... done:', node)

      await db.deleteNode(node.id)
    }
  }
}
