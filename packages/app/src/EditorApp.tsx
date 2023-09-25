import { FC, PropsWithChildren, useEffect } from 'react'
import { Provider } from 'jotai'
import { isServer } from '@penx/constants'
import { appLoader, useLoaderStatus } from '@penx/loader'
import { JotaiNexus, store } from '@penx/store'
import { ClientOnly } from './components/ClientOnly'
import { EditorLayout } from './EditorLayout/EditorLayout'

if (!isServer) {
  appLoader.init()
}

export const EditorApp: FC<PropsWithChildren> = ({ children }) => {
  const { isLoaded } = useLoaderStatus()

  useEffect(() => {
    persist()
      .then((d) => {
        //
      })
      .catch((e) => {
        //
      })
  }, [])

  console.log('isLoaded:', isLoaded)

  if (!isLoaded) {
    return null
  }

  return (
    <ClientOnly>
      <Provider store={store}>
        <JotaiNexus />
        <EditorLayout />
      </Provider>
    </ClientOnly>
  )
}

async function persist() {
  if (navigator.storage && navigator.storage.persist) {
    return navigator.storage.persist()
  }
}
