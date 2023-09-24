import { Fragment, useEffect, useState } from 'react'
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
import { IS_DB_OPENED } from '@penx/constants'

// import 'prismjs/themes/prism.css'
// import 'prismjs/themes/prism.css'
// import 'prismjs/themes/prism-twilight.css'

initFower()

if (!isServer) {
  db.database.connect().then(() => {
    db.init()
  })
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

  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      console.log(window[IS_DB_OPENED])
      if (window[IS_DB_OPENED]) {
        setConnected(true)
        clearInterval(id)
      }
    }, 10)
    return () => clearInterval(id)
  }, [])

  if (!connected) return null

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
