import { WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { clearNodes } from './clearNodes'
import { syncPenx101 } from './syncPenx101'
import { updateExtension } from './updateExtension'

self.addEventListener('message', async (event) => {
  await db.database.connect()
  if (event.data === WorkerEvents.START_POLLING) {
    // startPollingPush()
    // startPollingPull()
  }

  // updateExtension()
  await clearNodes()

  await syncPenx101()
})
