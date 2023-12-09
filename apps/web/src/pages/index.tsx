import React, { useEffect } from 'react'
import { GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import { EditorApp } from '@penx/app'
import { SessionProvider } from '@penx/session'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'
import { loadCatalog } from '~/utils'

const PageEditor = () => {
  const session = useSession()

  return (
    <WalletConnectProvider>
      <SessionProvider
        value={{
          data: session.data as any,
          loading: session.status === 'loading',
        }}
      >
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
