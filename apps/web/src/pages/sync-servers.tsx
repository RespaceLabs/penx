import React from 'react'
import { Box } from '@fower/react'
import { useSession } from 'next-auth/react'
import { SyncServer } from '@penx/app'
import { SessionProvider } from '@penx/session'
import { RecoveryPhrase } from '~/components/RecoveryPhrase/RecoveryPhrase'

const PageSyncServers = () => {
  const session = useSession()

  return (
    <SessionProvider
      value={{
        data: session.data as any,
        loading: session.status === 'loading',
      }}
    >
      <SyncServer />
    </SessionProvider>
  )
}

export default PageSyncServers
