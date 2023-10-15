import { WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { SyncService } from '@penx/service'
import { sleep } from '@penx/shared'

const INTERVAL = 5 * 1000
let isPolling = true

export async function startPollingPull() {
  while (isPolling) {
    await sync()
  }
}

async function sync() {
  // TODO: don't use toArray()
  const spaces = await db.listSpaces()
  const space = spaces.find((s) => s.isActive)!
  const syncService = await SyncService.init(space!)

  if (!isPolling) return await sleep(INTERVAL)
  const canPull = await syncService.isCanPull()

  // console.log('============can pull:', canPull)
  if (canPull) {
    try {
      isPolling = false
      postMessage(WorkerEvents.START_PULL)
      await syncService.pull()
      postMessage(WorkerEvents.PULL_SUCCEEDED)
      isPolling = true
    } catch (error) {
      postMessage(WorkerEvents.PULL_FAILED)
      console.log('error:', error)
      isPolling = true
    }
  }

  await sleep(INTERVAL)
}
