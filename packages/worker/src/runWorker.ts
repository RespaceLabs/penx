import { toast } from 'uikit'
import { PENX_101, SyncStatus, WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { spacesAtom, store, syncStatusAtom } from '@penx/store'

export function runWorker() {
  console.log('init web worker...')

  const worker = new Worker(new URL('./worker.ts', import.meta.url), {
    type: 'module',
  })

  worker.onmessage = async (event: MessageEvent<number>) => {
    // console.log(`WebWorker Response => ${event.data}`)

    if (event.data === WorkerEvents.SYNC_101_SUCCEEDED) {
      store.space.selectSpace(PENX_101)
    }

    if (event.data === WorkerEvents.START_PUSH) {
      store.set(syncStatusAtom, SyncStatus.PUSHING)
    }

    if (event.data === WorkerEvents.PUSH_SUCCEEDED) {
      store.set(syncStatusAtom, SyncStatus.NORMAL)

      const spaces = await db.listSpaces()
      store.set(spacesAtom, spaces)
    }

    if (event.data === WorkerEvents.PUSH_FAILED) {
      store.set(syncStatusAtom, SyncStatus.PUSH_FAILED)
      toast.error('Push failed')
    }

    if (event.data === WorkerEvents.START_PULL) {
      store.set(syncStatusAtom, SyncStatus.PULLING)
    }

    if (event.data === WorkerEvents.PULL_SUCCEEDED) {
      console.log('=====PULL_SUCCEEDED....')

      const spaces = await db.listSpaces()
      const activeSpace = await db.getActiveSpace()
      const nodes = await db.listNodesBySpaceId(activeSpace.id)
      store.space.setSpaces(spaces)
      store.node.setNodes(nodes)
      const [activeNode] = store.node.getActiveNodes()
      const newActiveNode = nodes.find((n) => n.id === activeNode.id)

      if (newActiveNode && store.router.isNode()) {
        store.node.selectNode(newActiveNode)
      }
    }

    if (event.data === WorkerEvents.PULL_FAILED) {
      store.set(syncStatusAtom, SyncStatus.PULL_FAILED)
      toast.error('Pull failed')
    }
  }

  worker.postMessage(WorkerEvents.START_POLLING)
}
