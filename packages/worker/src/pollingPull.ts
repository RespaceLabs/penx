import { get } from 'idb-keyval'
import { isProd, WorkerEvents } from '@penx/constants'
import { decryptString } from '@penx/encryption'
import { db } from '@penx/local-db'
import { sleep } from '@penx/shared'
import { getAuthorizedUser } from '@penx/storage'
import { getNodeMap } from '@penx/sync'
import { trpc } from '@penx/trpc-client'

// const INTERVAL = 5 * 1000
const INTERVAL = isProd ? 60 * 1000 : 20 * 1000

export async function startPollingPull() {
  while (true) {
    const data = await getAuthorizedUser()
    if (data) {
      await sync()
    }
    await sleep(INTERVAL)
  }
}

async function sync() {
  // await pullFromCloud(activeSpace)
  postMessage(WorkerEvents.PULL_SUCCEEDED)
}
