import { WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { sleep } from '@penx/shared'
import { trpc } from '@penx/trpc-client'

// const INTERVAL = 5 * 1000
const INTERVAL = 60 * 1000
let isPolling = true

export async function startPollingPull() {
  while (isPolling) {
    await sync()
    await sleep(INTERVAL)
  }
}

async function sync() {
  const spaces = await db.listSpaces()
  const space = spaces.find((s) => s.isActive)!
  if (!space.isCloud) return
  const remoteVersion = await trpc.space.version.query({
    spaceId: space.id,
  })

  const localVersion = space.hash.version
  console.log('local.version', localVersion, 'remote.version:', remoteVersion)

  // TODO: should use diff or websocket
  if (localVersion < remoteVersion) {
    console.log('pull.......')
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
      if (node) {
        await db.updateNode(node.id, rest as any)
      } else {
        await db.createNode({ ...item } as any)
      }
    }

    await db.updateSpace(space.id, {
      activeNodeIds: remoteSpace.activeNodeIds as any,
      hash: remoteSpace.hash as any,
    })

    postMessage(WorkerEvents.PULL_SUCCEEDED)
  }
}
