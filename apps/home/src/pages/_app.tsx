import { Fragment } from 'react'
import { Session } from 'next-auth'
import { NextSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'uikit'
import { isServer } from '@penx/constants'
import { TrpcProvider } from '@penx/trpc-client'
import { initFower } from '../common/initFower'
import '../styles/globals.css'

initFower()

interface Props<T> extends AppProps<T> {
  Component: AppProps<T>['Component'] & {
    Layout: any
    session: Session
  }
}

if (!isServer) {
  // TODO: move this code to a separate file
}

function MyApp({ Component, pageProps }: Props<any>) {
  const Layout = Component.Layout ? Component.Layout : Fragment

  return (
    <>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />

      <NextSeo
        title="PenX: A structured digital assets wallet for geeks"
        description="A structured digital assets wallet for geeks"
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://www.penx.io',
          siteName: 'PenX',
        }}
        twitter={{
          handle: '@coder_zion',
          site: '@coder_zion',
          cardType: 'summary_large_image',
        }}
      />

      <TrpcProvider>
        {/* <SpeedInsights /> */}
        <Layout>
          <Component {...pageProps} />
          <div id="portal" />
        </Layout>
        <ToastContainer position="bottom-right" />

        {/* <Analytics /> */}
      </TrpcProvider>
    </>
  )
}

export default MyApp
