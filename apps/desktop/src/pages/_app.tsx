import '~/styles/globals.css'
import '~/styles/command.scss'
import { useEffect, useState } from 'react'
import { register, unregister } from '@tauri-apps/api/globalShortcut'
import { invoke } from '@tauri-apps/api/tauri'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { ToastContainer } from 'uikit'
import { initFower } from '@penx/app'
import { appEmitter } from '@penx/event'
import { clearAuthorizedUser } from '@penx/storage'
import { store, StoreProvider } from '@penx/store'
import { TrpcProvider } from '@penx/trpc-client'
import { ClientOnly } from '~/components/ClientOnly'
import '@glideapps/glide-data-grid/dist/index.css'

initFower()

async function listenForHotkey(shortcut: string) {
  const { appWindow } = await import('@tauri-apps/api/window')

  await register(shortcut, async () => {
    if (document.hasFocus()) {
      await appWindow.hide()
    } else {
      await appWindow.show()
      await appWindow.center()
      await appWindow.setFocus()
      document.getElementById('searchBarInput')?.focus()
    }
  })
}

async function hideByEsc() {
  const { appWindow } = await import('@tauri-apps/api/window')
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      appWindow.hide()
    }
  })
}

function MyApp({ Component, pageProps }: AppProps) {
  const { push } = useRouter()

  useEffect(() => {
    const handleSignOut = () => {
      clearAuthorizedUser()
      store.setToken(null as any)
      push('/')
    }
    const shortcut = 'CommandOrControl+Shift+K'

    unregister(shortcut).then(() => {
      listenForHotkey('CommandOrControl+Shift+K')
    })

    hideByEsc()

    appEmitter.on('SIGN_OUT', handleSignOut)
    return () => {
      appEmitter.off('SIGN_OUT', handleSignOut)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    invoke<string>('greet', { name: 'Next.js' })
      .then((result) => {
        console.log('resu=lt', result)

        setGreeting(result)
      })
      .catch(console.error)

    invoke<string>('start_server')
      .then((result) => {
        console.log('start server...........:', result)
      })
      .catch(console.error)
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
