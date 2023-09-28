import { WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { startPollingPull } from './pollingPull'
import { startPollingPush } from './pollingPush'

self.addEventListener('message', async (event) => {
  await db.database.connect()
  if (event.data === WorkerEvents.START_POLLING) {
    // startPollingPush()
    // startPollingPull()
  }
})
