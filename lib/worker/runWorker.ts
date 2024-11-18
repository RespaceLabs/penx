import { store } from '@/store'
import { WorkerEvents } from '../constants'
import { db } from '../local-db'

export function runWorker() {
  console.log('init web worker...')

  const worker = new Worker(new URL('./worker.ts', import.meta.url), {
    type: 'module',
  })

  worker.onmessage = async (event: MessageEvent<number>) => {
    // console.log(`WebWorker Response => ${event.data}`)
    // if (event.data === WorkerEvents.PUSH_FAILED) {
    // }

    if (event.data === WorkerEvents.PULL_SUCCEEDED) {
      const nodes = await db.listNodesByUserId()
      store.node.setNodes(nodes)

      // TODO: need to improvement the logic
      window.location.reload()
    }
  }

  worker.postMessage(WorkerEvents.START_POLLING)
}
