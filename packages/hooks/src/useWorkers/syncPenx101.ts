import ky from 'ky'
import { WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { INode } from '@penx/model-types'
import { sleep } from '@penx/shared'

const INTERVAL = 5 * 60 * 1000
// const INTERVAL = 5 * 1000

let isPolling = true

export async function syncPenx101() {
  while (isPolling) {
    await sync()
    await sleep(INTERVAL)
  }
}

async function sync() {
  const space = await db.getSpace('penx-101')
  const favoriteNodes = await db.getFavoriteNode(space.id)

  // User visit first time
  const isOnboarding = !favoriteNodes.children?.length

  try {
    const url =
      'https://raw.githubusercontent.com/penx-dao/penx-101/main/nodes.json'

    const data: INode[] = await ky(url).json()

    // console.log('data:', data)

    const nodes = await db.listNodesBySpaceId('penx-101')
    for (const node of nodes) {
      await db.node.deleteByPk(node.id)
    }

    for (const item of data) {
      if (!space) break
      // console.log('find:', find)
      await db.createNode({
        ...item,
        spaceId: 'penx-101',
      })
    }

    console.log('sync 101 done')

    if (isOnboarding) {
      postMessage(WorkerEvents.SYNC_101_SUCCEEDED)
    }
  } catch (error) {
    console.log('error nodes:', error)
  }
}
