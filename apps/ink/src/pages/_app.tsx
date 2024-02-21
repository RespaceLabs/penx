import { Fragment } from 'react'
import { Session } from 'next-auth'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import 'next-auth/react'
import type { AppProps } from 'next/app'
import { initFower } from '../common/initFower'
import '../styles/globals.css'

initFower()

interface Props<T> extends AppProps<T> {
  Component: AppProps<T>['Component'] & {
    Layout: any
    session: Session
  }
}

function MyApp({ Component, pageProps }: Props<any>) {
  const Layout = Component.Layout ? Component.Layout : Fragment

  return (
    <>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
      <GoogleAnalytics trackPageViews />

      <Layout>
        <Component {...pageProps} />
        <div id="portal" />
      </Layout>
    </>
  )
}

export default MyApp
