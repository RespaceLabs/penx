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
import { emit, listen } from '@tauri-apps/api/event'
import { AppEvent, isServer } from '@penx/constants'
import { db } from '@penx/local-db'
import { uniqueId } from '@penx/unique-id'

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

async function init() {
  console.log('app init............')

  const shortcut = 'CommandOrControl+Shift+K'

  unregister(shortcut).then(() => {
    listenForHotkey('CommandOrControl+;')
  })

  hideByEsc()

  type Payload = {
    code: string
    commands: string
    id: string
    name: string
    version: string
  }

  listen(AppEvent.UPSERT_EXTENSION, async (data) => {
    const payload = data.payload as Payload
    const commands = JSON.parse(payload.commands || '[]')
    console.log('Hello==========:', payload, commands)
    await db.upsertExtension(payload.id, {
      commands: commands,
      name: payload.name,
      version: payload.version,
    })
  })

  listen('PreferencesClicked', (data) => {
    console.log('PreferencesClicked==========:', data.payload)
  })

  // listen('click', (data) => {
  //   console.log('emit==========:', data)
  // })

  // emit('click', {
  //   theMessage: 'Tauri is awesome!',
  // })
  // console.log('sqlite init.....')
  // const db = await Database.load('sqlite:penx.db')
  // console.log('db', db)

  // await db.execute(
  //   'CREATE TABLE IF NOT EXISTS todos (id TEXT PRIMARY KEY, title TEXT, status BOOLEAN)',
  // )

  // const result = await db.execute(
  //   'INSERT into todos (id, title, status) VALUES ($1, $2, $3)',
  //   [uniqueId(), 'title1', true],
  // )

  // const result = await db.select(`SELECT * FROM todos`)

  // console.log('todo result....:', result)
}

if (!isServer) {
  init()
}

function MyApp({ Component, pageProps }: AppProps) {
  const { push } = useRouter()

  useEffect(() => {
    const handleSignOut = () => {
      clearAuthorizedUser()
      store.setToken(null as any)
      push('/')
    }

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
