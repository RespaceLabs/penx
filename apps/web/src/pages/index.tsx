import React, { useEffect } from 'react'
import { GetStaticProps } from 'next'
import { signIn, signOut, useSession } from 'next-auth/react'
import { appEmitter, EditorApp, isServer } from '@penx/app'
import { SessionProvider } from '@penx/hooks'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'
import { loadCatalog } from '~/utils'

// TODO: move this code to a separate file
if (!isServer) {
  const handleSignOut = () => {
    signOut()
  }
  appEmitter.on('SIGN_OUT', handleSignOut)

  const handleSignIn = () => {
    signIn('google')
  }
  appEmitter.on('SIGN_IN_GOOGLE', handleSignIn)
}

const PageEditor = () => {
  const session = useSession()

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
