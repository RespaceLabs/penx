import React from 'react'
import { useSession } from 'next-auth/react'
import { EditorApp } from '@penx/app'
import { SessionProvider } from '@penx/session'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'

const PageEditor = () => {
  const session = useSession()

  return (
    <SessionProvider
      value={{
        data: session.data as any,
        loading: session.status === 'loading',
      }}
    >
      <EditorApp />
    </SessionProvider>
  )
}

export default PageEditor
