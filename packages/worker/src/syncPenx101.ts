import ky from 'ky'
import { PENX_101, WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { INode } from '@penx/model-types'
import { sleep } from '@penx/shared'

// const INTERVAL = 5 * 60 * 1000
const INTERVAL = 5 * 1000

let isPolling = true

export async function syncPenx101() {
  while (isPolling) {
    await sync()
    await sleep(INTERVAL)
  }
}

async function sync() {
  const space = await db.getSpace(PENX_101)

  if (!space) return

  const favoriteNodes = await db.getFavoriteNode(space.id)

  // User visit first time
  const isOnboarding = !favoriteNodes?.children?.length

  try {
    const url =
      'https://raw.githubusercontent.com/penx-dao/penx-101/main/nodes.json'

    const data: INode[] = await ky(url).json()

    for (const item of data) {
      if (!space) break

      const node = await db.getNode(item.id)
      if (node) {
        await db.updateNode(item.id, {
          ...item,
          spaceId: PENX_101,
        })
      } else {
        await db.createNode({
          ...item,
          spaceId: PENX_101,
        })
      }
    }

    console.log('sync 101 done')

    if (isOnboarding) {
      postMessage(WorkerEvents.SYNC_101_SUCCEEDED)
    }
  } catch (error) {
    console.log('sync 101 error :', error)
  }
}
