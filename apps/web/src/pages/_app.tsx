import { Fragment } from 'react'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { Analytics } from '@vercel/analytics/react'
import { EasyModalProvider } from 'easy-modal'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { toast, ToastContainer } from 'uikit'
import { shareEmitter, ShareEvent } from '@penx/app/src/AppEmitter'
import { encryptString } from '@penx/app/src/encryption'
import { isServer } from '@penx/constants'
import { copy } from '@penx/shared'
import { api, trpc } from '~/utils/api'
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

if (!isServer) {
  shareEmitter.on('onShare', (data) => {
    handleSharing(data)
  })
}

const handleSharing = async (data: ShareEvent) => {
  try {
    const sharedDocById = await trpc.sharedDoc.byId.query({ id: data.id })
    if (!sharedDocById) {
      await trpc.sharedDoc.create.mutate({
        id: data.id,
        title: data.title,
        content: encryptString(data.content),
        // content: data.content
      })
    }

    const isCoped = await copy(`${window.location.origin}/share?id=${data.id}`)
    if (isCoped) {
      toast.info('Copy sharing link successfully')
    } else {
      throw new Error('Copy failed')
    }
  } catch (error) {
    toast.error('Failed to generate sharing link')
    console.log('error:', error)
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
