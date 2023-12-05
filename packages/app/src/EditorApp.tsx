import { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { isServer } from '@penx/constants'
import { emitter } from '@penx/event'
import { useSession } from '@penx/hooks'
import { appLoader, useLoaderStatus } from '@penx/loader'
import { StoreProvider } from '@penx/store'
import { AppProvider } from './AppProvider'
import { ClientOnly } from './components/ClientOnly'
import { Fallback } from './Fallback/Fallback'
import { HotkeyBinding } from './HotkeyBinding'
import { UserQuery } from './UserQuery'
import { HomePage } from './Workbench/HomePage/HomePage'
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

export const EditorApp = () => {
  const { isLoaded } = useLoaderStatus()
  const session = useSession()

  // console.log('======session:', session)

  if (!isLoaded) {
    return null
  }

  return (
    <>
      <HomePage />
      <ClientOnly>
        <StoreProvider>
          <ErrorBoundary fallback={<Fallback />}>
            <WorkerStarter />
            {session && <UserQuery userId={session.userId} />}
            <HotkeyBinding />
            <AppProvider>
              <Workbench />
            </AppProvider>
          </ErrorBoundary>
        </StoreProvider>
      </ClientOnly>
    </>
  )
}
