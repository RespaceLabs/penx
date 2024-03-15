import { db } from '@penx/local-db'
import { ISpace } from '@penx/model-types'
import { store } from '@penx/store'
import { SyncServerClient } from '@penx/sync-server-client'

export async function syncFromCloud(space: ISpace) {
  const oldNodes = await db.listNodesBySpaceId(space.id)

  console.log('===========oldNodes:', oldNodes)

  const localLastModifiedTime = Math.max(
    ...oldNodes.map((n) => new Date(n.updatedAt).getTime()),
    0,
  )

  console.log('======localLastModifiedTime:', localLastModifiedTime)

  const mnemonic = store.user.getMnemonic()
  const client = new SyncServerClient(space, mnemonic)
  const newRemoteNodes = await client.getPullableNodes(localLastModifiedTime)

  console.log('======newRemoteNodes:', newRemoteNodes)

  // console.log('=========newRemoteNodes:', newRemoteNodes)

  if (!newRemoteNodes.length) return

  for (const item of newRemoteNodes) {
    const existedNode = oldNodes.find((n) => n.id === item.id)

    if (existedNode) {
      await db.updateNode(item.id, item as any)
    } else {
      await db.createNode(item as any)
    }
  }

  const localLastUpdatedAt = await db.getLastUpdatedAt(space.id)

  await db.updateSpace(space.id, {
    nodesLastUpdatedAt: new Date(localLastUpdatedAt),
  })

  return
}
