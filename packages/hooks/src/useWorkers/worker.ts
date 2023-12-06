import { WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { Session } from '@penx/store'
import { clearNodes } from './clearNodes'
import { normalizeNodes } from './normalizeNodes'
import { startPollingPull } from './pollingPull'
import { pollingPushToCloud } from './pollingPushToCloud'
import { pollingPushToGithub } from './pollingPushToGithub'
import { syncPenx101 } from './syncPenx101'

self.addEventListener('message', async (event) => {
  let session: Session
  await db.database.connect()

  if (event.data.type === WorkerEvents.UPDATE_SESSION) {
    session = event.data.value

    if (session) {
      pollingPushToCloud(session)
      startPollingPull(session)

      pollingPushToGithub(session)
    }
  }

  if (event.data === WorkerEvents.START_POLLING) {
  }

  // updateExtension()
  clearNodes()

  syncPenx101()

  normalizeNodes()
})
