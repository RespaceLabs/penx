import { get } from 'idb-keyval'
import { PENX_SESSION_USER, WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { User } from '@penx/model'
import { sleep } from '@penx/shared'
import { Session } from '@penx/store'
import { SyncService } from '@penx/sync'

const INTERVAL = 5 * 60 * 1000

export async function pollingPushToGithub(session: Session) {
  while (session) {
    try {
      await sync()
    } catch (error) {
      console.log('sync error', error)
    }
    await sleep(INTERVAL)
  }
}

async function sync() {
  console.log('push to github...........')
  try {
    const data = await get(PENX_SESSION_USER)
    if (!data) return

    postMessage(WorkerEvents.START_PUSH)

    const activeSpace = await db.getActiveSpace()

    const s = await SyncService.init(activeSpace, new User(data))

    await s.push()
    postMessage(WorkerEvents.PUSH_SUCCEEDED)
  } catch (error) {
    postMessage(WorkerEvents.PUSH_FAILED)
  }
}
