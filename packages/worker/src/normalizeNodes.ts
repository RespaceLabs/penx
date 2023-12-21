import ky from 'ky'
import { db } from '@penx/local-db'
import { INode, IRowNode, NodeType } from '@penx/model-types'
import { sleep } from '@penx/shared'

// const INTERVAL = 5 * 60 * 1000
const INTERVAL = 5 * 1000

let isPolling = true

export async function normalizeNodes() {
  while (isPolling) {
    await normalize()
    await sleep(INTERVAL)
  }
}

async function normalize() {
  const space = await db.getActiveSpace()
  const databases = await db.node.select({
    where: {
      spaceId: space.id,
      type: NodeType.DATABASE,
    },
  })
  for (const database of databases) {
    const rows = await db.node.select({
      where: {
        type: NodeType.ROW,
        databaseId: database.id,
      },
    })

    if (!rows.length) continue

    if (!Reflect.has(rows[0].props, 'sort')) {
      console.log('normalize node sort.....')
      let sort = 1
      for (const item of rows) {
        await db.updateNode<IRowNode>(item.id, {
          props: { ...item.props, sort },
        })
        sort++
      }
    }
  }
}
