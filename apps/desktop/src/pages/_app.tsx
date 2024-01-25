import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'uikit'
import { initFower } from '@penx/app'

initFower()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Component {...pageProps} />
    </>
  )
}
