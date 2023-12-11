import { Fragment, useEffect } from 'react'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { set } from 'idb-keyval'
import { Session } from 'next-auth'
import { SessionProvider, signIn, signOut } from 'next-auth/react'
import 'next-auth/react'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'uikit'
import { isServer, PENX_SESSION_USER } from '@penx/constants'
import { initSharing } from '~/common/handleSharing'
import { api } from '~/utils/api'
import { initFower } from '../common/initFower'
import { useLinguiInit } from '../utils'
import '@penx/local-db'
import 'simplebar-react/dist/simplebar.min.css'
import 'react-circular-progressbar/dist/styles.css'
import '../styles/globals.css'
import '../styles/command.scss'
import { fowerStore, Parser } from '@fower/react'
// import { SpeedInsights } from '@vercel/speed-insights/next'
import { appEmitter } from '@penx/app'

// import 'prismjs/themes/prism.css'
// import 'prismjs/themes/prism.css'
// import 'prismjs/themes/prism-twilight.css'

initFower()

interface Props<T> extends AppProps<T> {
  Component: AppProps<T>['Component'] & {
    Layout: any
    session: Session
  }
}
const queryClient = new QueryClient()

if (!isServer) {
  // console.log(
  //   'store.atomCache:',
  //   fowerStore.atomCache,
  //   Array.from(fowerStore.atomCache.values())[0]
  // )

  // setTimeout(() => {
  // }, 2000)

  initSharing()

  // TODO: move this code to a separate file
  const handleSignOut = () => {
    set(PENX_SESSION_USER, null)
    signOut()
  }
  appEmitter.on('SIGN_OUT', handleSignOut)

  const handleSignIn = () => {
    signIn('google')
  }
  appEmitter.on('SIGN_IN_GOOGLE', handleSignIn)
}

function MyApp({ Component, pageProps }: Props<any>) {
  useLinguiInit(pageProps.translation)
  const Layout = Component.Layout ? Component.Layout : Fragment

  return (
    <>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <QueryClientProvider client={queryClient}>
          <I18nProvider i18n={i18n}>
            {/* <SpeedInsights /> */}
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <ToastContainer position="bottom-right" />
          </I18nProvider>
          {/* <Analytics /> */}
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}

export default api.withTRPC(MyApp)
