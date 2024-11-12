import { db } from './local-db'
import { api } from './trpc'

export async function syncLatestNodes() {
  const nodes = await db.listNodesByUserId()
  const oneMinute = 60 * 1000
  const now = Date.now()
  const latestNodes = nodes.filter(
    (n) => now - new Date(n.updatedAt).valueOf() < oneMinute,
  )
  await api.node.sync.mutate({ nodes: JSON.stringify(latestNodes) })
}
