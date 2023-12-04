import { WorkerEvents } from '@penx/constants'
import { decryptString } from '@penx/encryption'
import { db } from '@penx/local-db'
import { sleep } from '@penx/shared'
import { Session } from '@penx/store'
import { getNodeMap } from '@penx/sync'
import { trpc } from '@penx/trpc-client'

// const INTERVAL = 5 * 1000
const INTERVAL = 60 * 1000

export async function startPollingPull(session: Session) {
  while (session) {
    await sync()
    await sleep(INTERVAL)
  }
}

async function sync() {
  const spaces = await db.listSpaces()
  const space = spaces.find((s) => s.isActive)!
  if (!space.isCloud) return
  const { password } = space

  const remoteVersion = await trpc.space.version.query({
    spaceId: space.id,
  })

  // console.log('get remote version....')

  const localVersion = space.nodeSnapshot.version
  // console.log(
  //   'pull==== local.version',
  //   localVersion,
  //   'remote.version:',
  //   remoteVersion,
  // )

  // TODO: should use diff or websocket
  if (localVersion < remoteVersion) {
    // console.log('pull.......')
    const nodes = await trpc.node.listBySpaceId.query({
      spaceId: space.id,
    })

    const remoteSpace = await trpc.space.byId.query({
      id: space.id,
    })

    const oldNodes = await db.listNodesBySpaceId(space.id)

    for (const item of oldNodes) {
      await db.deleteNode(item.id)
    }

    for (const item of nodes) {
      const node = await db.getNode(item.id)
      const { id, ...rest } = item
      // TODO: need improve code
      if (space.encrypted && space.password) {
        if (node) {
          await db.updateNode(node.id, {
            ...rest,
            element: JSON.parse(
              decryptString(item.element as string, password),
            ),
            props: JSON.parse(decryptString(item.props as string, password)),
          } as any)
        } else {
          await db.createNode({
            ...item,
            element: JSON.parse(
              decryptString(item.element as string, password),
            ),
            props: JSON.parse(decryptString(item.props as string, password)),
          } as any)
        }
      } else {
        if (node) {
          await db.updateNode(node.id, rest as any)
        } else {
          await db.createNode({ ...item } as any)
        }
      }
    }

    const newNodes = await db.listNodesBySpaceId(space.id)
    const newNodeMap = getNodeMap(newNodes, space)

    // don't use remote nodeMap
    await db.updateSpace(space.id, {
      activeNodeIds: remoteSpace.activeNodeIds as any,
      nodeSnapshot: {
        version: (remoteSpace.nodeSnapshot as any).version,
        nodeMap: newNodeMap,
      },
    })

    postMessage(WorkerEvents.PULL_SUCCEEDED)
  }
}
