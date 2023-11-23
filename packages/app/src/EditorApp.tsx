import { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useQuery } from '@tanstack/react-query'
import { Provider } from 'jotai'
import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'
import { isServer } from '@penx/constants'
import { emitter } from '@penx/event'
import { appLoader, useLoaderStatus } from '@penx/loader'
import { JotaiNexus, spacesAtom, store } from '@penx/store'
import { ClientOnly } from './components/ClientOnly'
import { HotkeyBinding } from './HotkeyBinding'
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
  const { status, data } = useSession()

  if (!isLoaded) {
    return null
  }

  return (
    <ClientOnly>
      <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
        <Provider store={store}>
          <WorkerStarter />

          {status === 'authenticated' && <UserQuery userId={data.userId} />}

          <LoginSuccessModal />
          <HotkeyBinding />
          <JotaiNexus />
          <Workbench />
        </Provider>
      </ErrorBoundary>
    </ClientOnly>
  )
}
