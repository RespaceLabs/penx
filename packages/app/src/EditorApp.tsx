import { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { isProd, isServer } from '@penx/constants'
import { emitter } from '@penx/event'
import { appLoader, useLoaderStatus } from '@penx/loader'
import { db } from '@penx/local-db'
import { useSession } from '@penx/session'
import { StoreProvider } from '@penx/store'
import { pullFromCloud } from '@penx/sync'
import { trpc } from '@penx/trpc-client'
import { runWorker } from '@penx/worker'
import { AppProvider } from './AppProvider'
import { ClientOnly } from './components/ClientOnly'
import { Fallback } from './Fallback/Fallback'
import { HotkeyBinding } from './HotkeyBinding'
import { UserQuery } from './UserQuery'
import { HomePage } from './Workbench/HomePage/HomePage'
import { Workbench } from './Workbench/Workbench'

if (!isServer) {
  appLoader.init()

  // emitter.on('ADD_NODE', () => {
  //   const spaces = store.get(spacesAtom)
  //   const activeSpace = spaces.find((space) => space.isActive)!
  //   // TODO:
  //   store.createDoc()
  // })

  let inited = false

  setTimeout(
    () => {
      if (inited) return
      inited = true
      runWorker()
    },
    isProd ? 5000 : 3000,
  )
}

export const EditorApp = () => {
  const { isLoaded } = useLoaderStatus()
  const { data: session } = useSession()

  // console.log('======session:', session)
  const sseInited = useRef(false)

  useEffect(() => {
    async function runSSE() {
      const eventSource = new EventSource(
        process.env.NEXT_PUBLIC_SPACE_INFO_SSE_URL!,
      )

      type SpaceInfo = { spaceId: string; lastModifiedTime: number }

      eventSource.onmessage = async (event) => {
        const data = event.data
        const spaceInfo: SpaceInfo = JSON.parse(data)
        console.log('===========spaceInfo:', spaceInfo)

        if (!spaceInfo?.spaceId) return

        const space = await db.getSpace(spaceInfo.spaceId)
        if (space) {
          const localLastModifiedTime = await db.getLastModifiedTime(space.id)

          console.log(
            'spaceInfo.lastModifiedTime > localLastModifiedTime:',
            spaceInfo.lastModifiedTime > localLastModifiedTime,
            spaceInfo.lastModifiedTime,
            localLastModifiedTime,
          )

          if (spaceInfo.lastModifiedTime > localLastModifiedTime) {
            await pullFromCloud(space)
          }
        }
      }

      eventSource.onerror = (error) => {
        console.error('SSE error:', error)
      }
    }

    if (!sseInited.current) {
      console.log('runSSE..............')
      runSSE()
      sseInited.current = true
    }
  }, [])

  if (!isLoaded) {
    return null
  }

  // console.log('render........ EditorApp')

  return (
    <>
      <HomePage />
      <ClientOnly>
        <StoreProvider>
          <ErrorBoundary fallback={<Fallback />}>
            {session && <UserQuery userId={session.userId} />}
            <HotkeyBinding />
            <AppProvider>
              <Workbench />
            </AppProvider>
          </ErrorBoundary>
        </StoreProvider>
      </ClientOnly>
    </>
  )
}
