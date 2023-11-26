import { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useSession } from 'next-auth/react'
import { isServer } from '@penx/constants'
import { emitter } from '@penx/event'
import { appLoader, useLoaderStatus } from '@penx/loader'
import { JotaiNexus, spacesAtom, store, StoreProvider } from '@penx/store'
import { AppProvider } from './AppProvider'
import { ClientOnly } from './components/ClientOnly'
import { HotkeyBinding } from './HotkeyBinding'
import { UserQuery } from './UserQuery'
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
  const { status, data } = useSession()

  if (!isLoaded) {
    return null
  }

  return (
    <ClientOnly>
      <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
        <StoreProvider>
          <WorkerStarter />
          {status === 'authenticated' && <UserQuery userId={data.userId} />}
          <HotkeyBinding />
          <AppProvider>
            <Workbench />
          </AppProvider>
        </StoreProvider>
      </ErrorBoundary>
    </ClientOnly>
  )
}
