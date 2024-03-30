import { get } from 'idb-keyval'
import { isProd } from '@penx/constants'
import { db } from '@penx/local-db'
import { sleep } from '@penx/shared'
import { getAuthorizedUser } from '@penx/storage'
import { store } from '@penx/store'
import { syncToCloud } from '@penx/sync'

const INTERVAL = isProd ? 5 * 1000 : 8 * 1000

export async function pollingPushToCloud() {
  const user = await getAuthorizedUser()

  if (!user?.id) return

  while (true) {
    try {
      const user = await getAuthorizedUser()
      if (user) {
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
  const mnemonic = store.user.getMnemonic()
  const isSynced = await syncToCloud(mnemonic)
  if (isSynced) {
    const spaces = await db.listSpaces()
    store.space.setSpaces(spaces)
  }
}
