import { WorkerEvents } from '@penx/constants'
import { startPollingPull } from './pollingPull'
import { startPollingPush } from './pollingPush'

self.addEventListener('message', async (event) => {
  if (event.data === WorkerEvents.START_POLLING) {
    startPollingPush()
    startPollingPull()
  }
})
