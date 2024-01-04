import { get } from 'idb-keyval'
import { isProd, PENX_SESSION_USER } from '@penx/constants'
import { db } from '@penx/local-db'
import { sleep } from '@penx/shared'
import { store } from '@penx/store'
import { syncToCloud } from '@penx/sync'

const INTERVAL = isProd ? 5 * 1000 : 8 * 1000

export async function pollingPushToCloud() {
  const user = await get(PENX_SESSION_USER)

  if (!user?.id) return

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
  // console.log('push to cloud...')

  const isSynced = await syncToCloud()
  if (isSynced) {
    const spaces = await db.listSpaces()
    store.space.setSpaces(spaces)
  }
}
