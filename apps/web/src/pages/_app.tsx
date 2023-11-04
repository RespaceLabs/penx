import { Fragment } from 'react'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { EasyModalProvider } from 'easy-modal'
import { Session } from 'next-auth'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'uikit'
import { isServer } from '@penx/constants'
import { initSharing } from '~/common/handleSharing'
import { api } from '~/utils/api'
import { initFower } from '../common/initFower'
import { useLinguiInit } from '../utils'
import '@penx/local-db'
import '../styles/globals.css'
import '../styles/command.scss'

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
  initSharing()
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

      <QueryClientProvider client={queryClient}>
        <I18nProvider i18n={i18n}>
          <EasyModalProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <ToastContainer position="bottom-right" />
          </EasyModalProvider>
        </I18nProvider>
        {/* <Analytics /> */}
      </QueryClientProvider>
    </>
  )
}

export default api.withTRPC(MyApp)
