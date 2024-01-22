import ky from 'ky'
import { decryptString } from '@penx/encryption'
import { db } from '@penx/local-db'
import { INode, ISpace } from '@penx/model-types'

export async function syncFromCloud(space: ISpace) {
  const { password } = space

  const oldNodes = await db.listNodesBySpaceId(space.id)

  const localLastModifiedTime = Math.max(
    ...oldNodes.map((n) => new Date(n.updatedAt).getTime()),
  )

  console.log('======localLastModifiedTime:', localLastModifiedTime)

  const newRemoteNodes = await ky
    .post(`${space.syncServerUrl}/get-pullable-nodes`, {
      json: {
        spaceId: space.id,
        lastModifiedTime: localLastModifiedTime,
      },
    })
    .json<INode[]>()

  if (!newRemoteNodes.length) return

  const encrypted = space.encrypted && space.password

  for (const item of newRemoteNodes) {
    const existedNode = oldNodes.find((n) => n.id === item.id)

    if (existedNode) {
      if (encrypted) {
        await db.updateNode(item.id, {
          ...item,
          element: JSON.parse(decryptString(item.element as string, password)),
          props: JSON.parse(decryptString(item.props as any, password)),
        } as any)
      } else {
        await db.updateNode(existedNode.id, item)
      }
    } else {
      if (encrypted) {
        await db.createNode({
          ...item,
          element: JSON.parse(decryptString(item.element as string, password)),
          props: JSON.parse(decryptString(item.props as any, password)),
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
