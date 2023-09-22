import { Fragment, useEffect } from 'react'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { Analytics } from '@vercel/analytics/react'
import { EasyModalProvider } from 'easy-modal'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'uikit'
import { api } from '~/utils/api'
import { initFower } from '../common/initFower'
import { useLinguiInit } from '../utils'
import '@penx/local-db'
import { db } from '@penx/local-db'
import { isServer } from '~/common/utils'
import '../styles/globals.css'
import '../styles/command.scss'

// import 'prismjs/themes/prism.css'
// import 'prismjs/themes/prism.css'
// import 'prismjs/themes/prism-twilight.css'

initFower()

if (!isServer) {
  db.init()
}

interface Props<T> extends AppProps<T> {
  Component: AppProps<T>['Component'] & {
    Layout: any
    session: Session
  }
}

function MyApp({ Component, pageProps }: Props<any>) {
  useLinguiInit(pageProps.translation)
  const Layout = Component.Layout ? Component.Layout : Fragment

  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <I18nProvider i18n={i18n}>
        <EasyModalProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ToastContainer position="bottom-right" />
        </EasyModalProvider>
      </I18nProvider>
      {/* <Analytics /> */}
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
