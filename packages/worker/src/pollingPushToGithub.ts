import { get } from 'idb-keyval'
import { isProd, PENX_SESSION_USER, WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { User } from '@penx/model'
import { sleep } from '@penx/shared'
import { SyncService } from '@penx/sync'

const INTERVAL = isProd ? 10 * 60 * 1000 : 10 * 1000

let count = 0
let interval = 10

export async function pollingPushToGithub() {
  while (true) {
    const data = await get(PENX_SESSION_USER)

    if (data) {
      await sync()
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

    if (!activeSpace) return

    const nodes = await db.listNodesBySpaceId(activeSpace.id)

    if (!nodes.length) return

    postMessage(WorkerEvents.START_PUSH)

    const s = await SyncService.init(activeSpace, user)

    // console.log('start github push.............')

    const value = count % interval

    // console.log('value==========:', value)

    await s.push()

    // if (value === interval - 1) {
    //   await s.pushAll()
    // } else {
    //   await s.push()
    // }
    postMessage(WorkerEvents.PUSH_SUCCEEDED)
  } catch (error) {
    console.log('push to github error========', error)

    postMessage(WorkerEvents.PUSH_FAILED)
  }

  count++
}
