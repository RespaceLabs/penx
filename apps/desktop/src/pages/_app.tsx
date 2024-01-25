import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'uikit'
import { initFower } from '@penx/app'
import { TrpcProvider } from '@penx/trpc-client'
import { api } from '~/utils/api'

initFower()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TrpcProvider>
      <ToastContainer position="bottom-right" />
      <Component {...pageProps} />
    </TrpcProvider>
  )
}

// export default api.withTRPC(MyApp)
export default MyApp
