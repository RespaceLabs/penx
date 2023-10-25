import { WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { SyncService } from '@penx/service'
import { sleep } from '@penx/shared'

const INTERVAL = 5 * 1000
let isPolling = true

export async function startPollingPush() {
  while (isPolling) {
    console.log('polling...')
    await sync()
  }
}

async function sync() {
  // TODO: don't use toArray()
  const spaces = await db.listSpaces()
  const space = spaces.find((s) => s.isActive)!

  // const syncService = await SyncService.init(space!)

  // if (changeService.isCanPush(10)) {
  //   try {
  //     isPolling = false
  //     postMessage(`worker canPush: ${changeService.isCanPush()}`)

  //     postMessage(WorkerEvents.START_PUSH)

  //     await syncService.push()

  //     postMessage(WorkerEvents.PUSH_SUCCEEDED)
  //     isPolling = true
  //   } catch (error) {
  //     console.log('error:', error)
  //     postMessage(WorkerEvents.PUSH_FAILED)
  //     isPolling = true
  //   }
  // }

  await sleep(INTERVAL)
}
