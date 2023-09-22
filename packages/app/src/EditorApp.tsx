import { FC, PropsWithChildren } from 'react'
import { Provider } from 'jotai'
import { useWorkers } from '@penx/hooks'
import { JotaiNexus, store } from '@penx/store'
import { ClientOnly } from './components/ClientOnly'
import { EditorLayout } from './EditorLayout/EditorLayout'

export const EditorApp: FC<PropsWithChildren> = ({ children }) => {
  useWorkers()

  return (
    <ClientOnly>
      <Provider store={store}>
        <JotaiNexus />
        <EditorLayout />
      </Provider>
    </ClientOnly>
  )
}
