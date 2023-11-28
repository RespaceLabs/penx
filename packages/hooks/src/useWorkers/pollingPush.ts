import { db } from '@penx/local-db'
import { sleep } from '@penx/shared'
import { Session, store } from '@penx/store'
import { syncToCloud } from '@penx/sync'

const INTERVAL = 5 * 1000

export async function startPollingPush(session: Session) {
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
  const isSynced = await syncToCloud()
  if (isSynced) {
    const spaces = await db.listSpaces()
    store.space.setSpaces(spaces)
  }
}
