import { decryptString } from '@penx/encryption'
import { db } from '@penx/local-db'
import { ISpace } from '@penx/model-types'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

export async function pullFromCloud(space: ISpace) {
  const { password } = space

  const remoteLastModifiedTime = await trpc.space.lastModifiedTime.query({
    spaceId: space.id,
  })

  const oldNodes = await db.listNodesBySpaceId(space.id)

  const localLastModifiedTime = Math.max(
    ...oldNodes.map((n) => n.updatedAt.getTime()),
  )

  console.log(
    '====Local=lastModifiedTime:',
    localLastModifiedTime,
    'remoteLastModifiedTime:',
    remoteLastModifiedTime?.getTime(),
  )

  const newRemoteNodes = await trpc.node.pullNodes.query({
    spaceId: space.id,
    lastModifiedTime: localLastModifiedTime,
  })

  console.log('=========newRemoteNodes:', newRemoteNodes)

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

  const newNodes = await db.listNodesBySpaceId(space.id)

  store.node.setNodes(newNodes)
  store.node.selectDailyNote()
  return
}
