import React, { useEffect } from 'react'
import isEqual from 'react-fast-compare'
import { useAtom, useSetAtom } from 'jotai'
import { GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import { EditorApp } from '@penx/app'
import { SessionProvider } from '@penx/hooks'
import { sessionAtom, store } from '@penx/store'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'
import { loadCatalog } from '~/utils'

const PageEditor = () => {
  const session = useSession()
  const [sessionValue, setSession] = useAtom(sessionAtom)

  useEffect(() => {
    if (session.status === 'authenticated') {
      setSession(session.data as any)
    }
  }, [session, sessionValue, setSession])

  return (
    <WalletConnectProvider>
      <SessionProvider value={session.data as any}>
        <EditorApp />
      </SessionProvider>
    </WalletConnectProvider>
  )
}

export default PageEditor

export const getStaticProps: GetStaticProps = async (ctx) => {
  const translation = await loadCatalog(ctx.locale!)
  return {
    props: {
      translation,
    },
  }
}
