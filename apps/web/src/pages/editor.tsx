import React from 'react'
import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'
import { EditorApp } from '@penx/app'
import { SessionProvider } from '@penx/session'

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
