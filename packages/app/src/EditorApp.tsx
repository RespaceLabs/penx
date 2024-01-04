import { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { set } from 'idb-keyval'
import { isProd, isServer, PENX_SESSION_USER_ID } from '@penx/constants'
import { appLoader, useLoaderStatus } from '@penx/loader'
import { useSession } from '@penx/session'
import { StoreProvider } from '@penx/store'
import { runWorker } from '@penx/worker'
import { AppProvider } from './AppProvider'
import { runSSE } from './common/runSSE'
import { ClientOnly } from './components/ClientOnly'
import { Fallback } from './Fallback/Fallback'
import { HomePage } from './HomePage/HomePage'
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

  // console.log('======session:', session)
  const sseInited = useRef(false)

  useEffect(() => {
    if (!sseInited.current && session?.user) {
      console.log('runSSE..............')
      runSSE()
      sseInited.current = true
    }

    set(PENX_SESSION_USER_ID, session?.user?.id)
  }, [session])

  if (!isLoaded) {
    return null
  }

  // console.log('render........ EditorApp')
  if (!session) return null

  return (
    <>
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
    </>
  )
}
