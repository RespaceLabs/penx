import { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useQuery } from '@tanstack/react-query'
import { Provider } from 'jotai'
import { useAccount } from 'wagmi'
import { isServer } from '@penx/constants'
import { emitter } from '@penx/event'
import { appLoader, useLoaderStatus } from '@penx/loader'
import { JotaiNexus, spacesAtom, store } from '@penx/store'
import { trpc } from '@penx/trpc-client'
import { ClientOnly } from './components/ClientOnly'
import { HotkeyBinding } from './HotkeyBinding'
import { SyncDetectorModal } from './SyncDetectorModal'
import { UserQuery } from './UserQuery'
import { LoginSuccessModal } from './Workbench/LoginSuccessModal'
import { Workbench } from './Workbench/Workbench'
import { WorkerStarter } from './WorkerStarter'

if (!isServer) {
  appLoader.init()

  // emitter.on('ADD_NODE', () => {
  //   const spaces = store.get(spacesAtom)
  //   const activeSpace = spaces.find((space) => space.isActive)!
  //   // TODO:
  //   store.createDoc()
  // })
}

export const EditorApp: FC<PropsWithChildren> = ({ children }) => {
  const { isLoaded } = useLoaderStatus()
  const { address = '' } = useAccount()
  const createRef = useRef(false)

  useEffect(() => {
    if (!address || createRef.current) return

    trpc.user.create.mutate({ address })

    createRef.current = true
  }, [address])

  useEffect(() => {
    persist()
      .then((d) => {
        //
      })
      .catch((e) => {
        //
      })
  }, [])

  if (!isLoaded) {
    return null
  }

  return (
    <ClientOnly>
      <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
        <Provider store={store}>
          {address && <SyncDetectorModal />}

          <WorkerStarter />
          <UserQuery />
          <LoginSuccessModal />
          <HotkeyBinding />
          <JotaiNexus />
          <Workbench />
        </Provider>
      </ErrorBoundary>
    </ClientOnly>
  )
}

async function persist() {
  if (navigator.storage && navigator.storage.persist) {
    return navigator.storage.persist()
  }
}
