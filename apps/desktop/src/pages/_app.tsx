import '~/styles/globals.css'
import { useEffect } from 'react'
import { set } from 'idb-keyval'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { ToastContainer } from 'uikit'
import { appEmitter, initFower } from '@penx/app'
import { PENX_SESSION_USER } from '@penx/constants'
import { store } from '@penx/store'
import { TrpcProvider } from '@penx/trpc-client'

initFower()

function MyApp({ Component, pageProps }: AppProps) {
  const { push } = useRouter()
  useEffect(() => {
    const handleSignOut = () => {
      set(PENX_SESSION_USER, null)
      store.setToken(null as any)
      push('/')
    }

    appEmitter.on('SIGN_OUT', handleSignOut)
    return () => {
      appEmitter.off('SIGN_OUT', handleSignOut)
    }
  }, [])
  return (
    <TrpcProvider>
      <ToastContainer position="bottom-right" />
      <Component {...pageProps} />
    </TrpcProvider>
  )
}

export default MyApp
