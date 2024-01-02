import { get } from 'idb-keyval'
import { isProd, PENX_SESSION_USER, WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { User } from '@penx/model'
import { sleep } from '@penx/shared'
import { SyncService } from '@penx/sync'

const INTERVAL = isProd ? 5 * 60 * 1000 : 20 * 1000

export async function pollingPushToGithub() {
  while (true) {
    try {
      const data = await get(PENX_SESSION_USER)
      if (data) {
        await sync()
      }
    } catch (error) {
      console.log('sync error', error)
    }
    await sleep(INTERVAL)
  }
}

async function sync() {
  // console.log('push to github...........')
  try {
    const data = await get(PENX_SESSION_USER)
    if (!data) return

    const user = new User(data)
    // console.log('data--------user:', user)

    if (!user.github.repo) return
    const activeSpace = await db.getActiveSpace()

    const nodes = await db.listNodesBySpaceId(activeSpace.id)

    if (!nodes.length) return

    postMessage(WorkerEvents.START_PUSH)

    const s = await SyncService.init(activeSpace, user)

    await s.push()
    postMessage(WorkerEvents.PUSH_SUCCEEDED)
  } catch (error) {
    postMessage(WorkerEvents.PUSH_FAILED)
  }
}
