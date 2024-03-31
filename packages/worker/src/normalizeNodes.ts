import ky from 'ky'
import { db } from '@penx/local-db'
import { INode, IRowNode, NodeType } from '@penx/model-types'
import { sleep } from '@penx/shared'
import { getActiveSpaceId } from '@penx/storage'

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
  const spaceId = await getActiveSpaceId()
  if (!spaceId) return
  const spaces = await db.listSpaces()

  const space = spaces.find((i) => i.id === spaceId)
  if (!space) return

  const databases = await db.node
    .where({
      where: {
        type: NodeType.DATABASE,
        spaceId: space.id,
      },
    })
    .toArray()

  for (const database of databases) {
    const rows = await db.node
      .where({
        where: {
          type: NodeType.ROW,
          databaseId: database.id,
        },
      })
      .toArray()

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
