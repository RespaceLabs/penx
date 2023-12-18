import { get } from 'idb-keyval'
import ky from 'ky'
import {
  isProd,
  PENX_101,
  PENX_101_CLOUD_NAME,
  PENX_SESSION_USER,
  WorkerEvents,
} from '@penx/constants'
import { db } from '@penx/local-db'
import { Node, User } from '@penx/model'
import { INode } from '@penx/model-types'
import { sleep } from '@penx/shared'

const INTERVAL = isProd ? 5 * 60 * 1000 : 5 * 1000

let isPolling = true

export async function syncPenx101() {
  while (isPolling) {
    await sync()
    await sleep(INTERVAL)
  }
}

async function sync() {
  const sessionUser = await get(PENX_SESSION_USER)

  if (sessionUser?.email === '0xyz.penx@gmail.com') {
    return
  }

  const space = await db.getSpace(PENX_101)
  const space101 = await db.getSpace(PENX_101_CLOUD_NAME)

  if (!space && !space101) {
    await db.createSpace(
      {
        id: PENX_101,
        name: 'PenX 101',
      },
      false,
    )
  }

  const nodes = await db.listNodesBySpaceId(space.id)

  // User visit first time
  const isOnboarding = !nodes.length

  // console.log('========isOnboarding:', isOnboarding, nodes.length)

  try {
    const url =
      'https://raw.githubusercontent.com/penx-dao/penx-101/main/nodes.json'

    const data: INode[] = await ky(url).json()

    // console.log('data:', data, 'space:', space)

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

    // console.log('sync 101 done')

    if (isOnboarding) {
      postMessage(WorkerEvents.SYNC_101_SUCCEEDED)
    }
  } catch (error) {
    console.log('sync 101 error :', error)
  }
}
