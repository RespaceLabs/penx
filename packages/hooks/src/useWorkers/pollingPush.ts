import { db } from '@penx/local-db'
import { sleep } from '@penx/shared'
import { store } from '@penx/store'
import { syncToCloud } from '@penx/sync'

const INTERVAL = 5 * 1000
let isPolling = true

export async function startPollingPush() {
  while (isPolling) {
    console.log('polling push.....')
    try {
      await sync()
    } catch (error) {
      console.log('sync error', error)
    }
    await sleep(INTERVAL)
  }
}

async function sync() {
  const isSynced = await syncToCloud()
  if (isSynced) {
    const spaces = await db.listSpaces()
    store.setSpaces(spaces)
  }
}
