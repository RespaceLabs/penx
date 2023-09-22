import { WorkerEvents } from '@penx/constants'
import { ChangeService, SyncService } from '@penx/domain'
import { db } from '@penx/local-db'
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
  const spaces = await db.space.toArray()
  const space = spaces.find((s) => s.isActive)!

  const changeService = new ChangeService(space)
  const syncService = await SyncService.init(space!)

  if (changeService.isCanPush(10)) {
    try {
      isPolling = false
      postMessage(`worker canPush: ${changeService.isCanPush()}`)

      postMessage(WorkerEvents.START_PUSH)

      await syncService.push()

      postMessage(WorkerEvents.PUSH_SUCCEEDED)
      isPolling = true
    } catch (error) {
      console.log('error:', error)
      postMessage(WorkerEvents.PUSH_FAILED)
      isPolling = true
    }
  }

  await sleep(INTERVAL)
}
