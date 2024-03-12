import { FC, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { set } from 'idb-keyval'
import {
  BASE_URL,
  isProd,
  isServer,
  PENX_SESSION_USER_ID,
} from '@penx/constants'
import { appLoader, useLoaderStatus } from '@penx/loader'
import { useSession } from '@penx/session'
import { StoreProvider } from '@penx/store'
import { TrpcProvider } from '@penx/trpc-client'
import { runWorker } from '@penx/worker'
import { AppProvider } from './AppProvider'
import { ClientOnly } from './components/ClientOnly'
import { Fallback } from './Fallback/Fallback'
import { HotkeyBinding } from './HotkeyBinding'
import { SpaceSyncManager } from './SpaceSyncManager'
import { UserQuery } from './UserQuery'
import { Workbench } from './Workbench/Workbench'

if (!isServer) {
  appLoader.init()

  // emitter.on('ADD_NODE', () => {
  //   const spaces = store.get(spacesAtom)
  //   const activeSpace = spaces.find((space) => space.isActive)!
  //   // TODO:
  //   store.createDoc()
  // })

  let inited = false

  setTimeout(
    () => {
      if (inited) return
      inited = true
      runWorker()
    },
    isProd ? 5000 : 3000,
  )
}

export const EditorApp = () => {
  const { isLoaded } = useLoaderStatus()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.userId) {
      set(PENX_SESSION_USER_ID, session?.userId)
    }
  }, [session])

  if (!isLoaded) {
    return null
  }

  if (!session) return null

  return (
    <ClientOnly>
      <StoreProvider>
        <ErrorBoundary fallback={<Fallback />}>
          {session && <UserQuery userId={session.userId} />}
          <HotkeyBinding />
          <SpaceSyncManager userId={session?.userId}>
            <AppProvider>
              <Workbench />
            </AppProvider>
          </SpaceSyncManager>
        </ErrorBoundary>
      </StoreProvider>
    </ClientOnly>
  )
}
