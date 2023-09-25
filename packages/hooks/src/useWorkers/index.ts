import { useEffect, useRef } from 'react'
import { toast } from 'uikit'
import { SyncStatus, WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { store } from '@penx/store'

export function useWorkers() {
  const workerRef = useRef<Worker>()

  useEffect(() => {
    workerRef.current = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module',
    })

    workerRef.current.onmessage = async (event: MessageEvent<number>) => {
      console.log(`WebWorker Response => ${event.data}`)

      if (event.data === WorkerEvents.START_PUSH) {
        store.setSyncStatus(SyncStatus.PUSHING)
      }

      if (event.data === WorkerEvents.PUSH_SUCCEEDED) {
        store.setSyncStatus(SyncStatus.NORMAL)

        const spaces = await db.listSpaces()
        store.setSpaces(spaces)
      }

      if (event.data === WorkerEvents.PUSH_FAILED) {
        store.setSyncStatus(SyncStatus.PUSH_FAILED)
        toast.error('Push failed')
      }

      if (event.data === WorkerEvents.START_PULL) {
        store.setSyncStatus(SyncStatus.PULLING)
      }

      if (event.data === WorkerEvents.PULL_SUCCEEDED) {
        store.setSyncStatus(SyncStatus.NORMAL)

        const spaces = await db.listSpaces()
        store.setSpaces(spaces)

        const activeSpace = spaces.find((space) => space.isActive)

        const doc = await db.getDoc(activeSpace?.activeDocId!)

        store.setDoc(null as any)

        // for rerender editor
        setTimeout(() => {
          store.setDoc(doc!)
        }, 0)
      }

      if (event.data === WorkerEvents.PULL_FAILED) {
        store.setSyncStatus(SyncStatus.PULL_FAILED)
        toast.error('Pull failed')
      }
    }

    workerRef.current.postMessage(WorkerEvents.START_POLLING)

    return () => {
      workerRef.current?.terminate()
    }
  }, [])
}
