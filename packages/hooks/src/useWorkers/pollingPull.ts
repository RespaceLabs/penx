import { WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { SyncService } from '@penx/service'
import { sleep } from '@penx/shared'
import { trpc } from '@penx/trpc-client'

const INTERVAL = 5 * 1000
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
  const remoteVersion = await trpc.space.version.query({ spaceId: space.id })

  console.log('local.version', space.version, 'remote.version:', remoteVersion)

  if (space.version < remoteVersion) {
    console.log('pull.......')
    const nodes = await trpc.node.listBySpaceId.query({
      spaceId: space.id,
    })

    for (const item of nodes) {
      const node = await db.getNode(item.id)
      const { id, createdAt, updatedAt, openedAt, ...rest } = item
      if (node) {
        // TODO: handle date
        await db.updateNode(node.id, rest as any)
      } else {
        await db.createNode({
          ...item,
          createdAt: createdAt.getTime(),
          updatedAt: updatedAt.getTime(),
          openedAt: openedAt.getTime(),
        } as any)
      }
    }

    await db.updateSpace(space.id, {
      version: remoteVersion,
    })

    postMessage(WorkerEvents.PULL_SUCCEEDED)
  }
}
