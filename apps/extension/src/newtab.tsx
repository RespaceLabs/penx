import './globals.css'

import { EditorApp, initFower } from '@penx/app'
import { SessionProvider } from '@penx/session'

import { TrpcProvider } from './components/TrpcProvider'
import { useSession } from './hooks/useSession'

initFower()

function IndexNewtab() {
  const session = useSession()

  return (
    <TrpcProvider token={session?.data?.accessToken}>
      <SessionProvider value={session}>
        <EditorApp />
      </SessionProvider>
    </TrpcProvider>
  )
}

export default IndexNewtab
