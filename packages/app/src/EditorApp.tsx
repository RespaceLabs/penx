import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { Provider } from 'jotai'
import { useWorkers } from '@penx/hooks'
import { db } from '@penx/local-db'
import { JotaiNexus, store } from '@penx/store'
import { ClientOnly } from './components/ClientOnly'
import { EditorLayout } from './EditorLayout/EditorLayout'

export const EditorApp: FC<PropsWithChildren> = ({ children }) => {
  useWorkers()

  const [connected, setConnected] = useState(false)

  // TODO:
  useEffect(() => {
    db.database.connect().then(() => {
      setConnected(true)
      db.init()
    })
  }, [])

  if (!connected) return null

  return (
    <ClientOnly>
      <Provider store={store}>
        <JotaiNexus />
        <EditorLayout />
      </Provider>
    </ClientOnly>
  )
}
