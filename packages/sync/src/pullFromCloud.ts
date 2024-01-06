import { decryptString } from '@penx/encryption'
import { db } from '@penx/local-db'
import { ISpace } from '@penx/model-types'
import { trpc } from '@penx/trpc-client'

export async function syncFromCloud(space: ISpace) {
  const { password } = space

  const oldNodes = await db.listNodesBySpaceId(space.id)

  const localLastModifiedTime = Math.max(
    ...oldNodes.map((n) => n.updatedAt.getTime()),
  )

  const newRemoteNodes = await trpc.node.pullNodes.query({
    spaceId: space.id,
    lastModifiedTime: localLastModifiedTime,
  })

  if (!newRemoteNodes.length) return

  // console.log('=========newRemoteNodes:', newRemoteNodes)

  const encrypted = space.encrypted && space.password

  for (const item of newRemoteNodes) {
    const existedNode = oldNodes.find((n) => n.id === item.id)

    if (existedNode) {
      if (encrypted) {
        await db.updateNode(item.id, {
          ...item,
          element: JSON.parse(decryptString(item.element as string, password)),
          props: JSON.parse(decryptString(item.props as string, password)),
        } as any)
      } else {
        await db.updateNode(existedNode.id, item)
      }
    } else {
      if (encrypted) {
        await db.createNode({
          ...item,
          element: JSON.parse(decryptString(item.element as string, password)),
          props: JSON.parse(decryptString(item.props as string, password)),
        } as any)
      } else {
        await db.createNode(item as any)
      }
    }
  }

  const localLastUpdatedAt = await db.getLastUpdatedAt(space.id)

  await db.updateSpace(space.id, {
    nodesLastUpdatedAt: new Date(localLastUpdatedAt),
  })

  return
}
