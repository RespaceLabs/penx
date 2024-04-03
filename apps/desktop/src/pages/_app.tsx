import '~/styles/globals.css'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { ToastContainer } from 'uikit'
import { initFower } from '@penx/app'
import { store, StoreProvider } from '@penx/store'
import { TrpcProvider } from '@penx/trpc-client'
import { ClientOnly } from '~/components/ClientOnly'
import '@glideapps/glide-data-grid/dist/index.css'
import { appEmitter } from '@penx/event'
import { clearAuthorizedUser } from '@penx/storage'

initFower()

function MyApp({ Component, pageProps }: AppProps) {
  const { push } = useRouter()
  useEffect(() => {
    const handleSignOut = () => {
      clearAuthorizedUser()
      store.setToken(null as any)
      push('/')
    }

    appEmitter.on('SIGN_OUT', handleSignOut)
    return () => {
      appEmitter.off('SIGN_OUT', handleSignOut)
    }
  }, [])

  return (
    <ClientOnly>
      <StoreProvider>
        <TrpcProvider>
          <ToastContainer position="bottom-right" />
          <Component {...pageProps} />
        </TrpcProvider>
      </StoreProvider>
    </ClientOnly>
  )
}

export default MyApp
