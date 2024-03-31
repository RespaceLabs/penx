import { ErrorBoundary } from 'react-error-boundary'
import { isProd, isServer } from '@penx/constants'
import { useSession } from '@penx/session'
import { runWorker } from '@penx/worker'
import { AppProvider } from './AppProvider'
import { ClientOnly } from './components/ClientOnly'
import { Fallback } from './Fallback/Fallback'
import { HotkeyBinding } from './HotkeyBinding'
import { SpaceSyncManager } from './SpaceSyncManager'
import { UserQuery } from './UserQuery'
import { Workbench } from './Workbench/Workbench'

if (!isServer) {
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
  const { data: session } = useSession()
  // console.log('============session:', session)

  return (
    <ClientOnly>
      <ErrorBoundary fallback={<Fallback />}>
        {!!session && navigator.onLine && <UserQuery userId={session.userId} />}
        <HotkeyBinding />
        <SpaceSyncManager userId={session?.userId}>
          <AppProvider>
            <Workbench />
          </AppProvider>
        </SpaceSyncManager>
      </ErrorBoundary>
    </ClientOnly>
  )
}
