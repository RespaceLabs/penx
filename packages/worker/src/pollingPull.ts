import { get } from 'idb-keyval'
import { isProd, PENX_SESSION_USER, WorkerEvents } from '@penx/constants'
import { decryptString } from '@penx/encryption'
import { db } from '@penx/local-db'
import { sleep } from '@penx/shared'
import { getNodeMap, pullFromCloud } from '@penx/sync'
import { trpc } from '@penx/trpc-client'

// const INTERVAL = 5 * 1000
const INTERVAL = isProd ? 60 * 1000 : 20 * 1000

export async function startPollingPull() {
  while (true) {
    const data = await get(PENX_SESSION_USER)
    if (data) {
      await sync()
    }
    await sleep(INTERVAL)
  }
}

async function sync() {
  const activeSpace = await db.getActiveSpace()
  await pullFromCloud(activeSpace)
  postMessage(WorkerEvents.PULL_SUCCEEDED)
}
