import { db } from '@penx/local-db'
import { sleep } from '@penx/shared'
import { Session, store } from '@penx/store'
import { syncToCloud } from '@penx/sync'

const INTERVAL = 10 * 1000

export async function pollingPushToCloud(session: Session) {
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
  // console.log('push to cloud...')

  const isSynced = await syncToCloud()
  if (isSynced) {
    const spaces = await db.listSpaces()
    store.space.setSpaces(spaces)
  }
}
