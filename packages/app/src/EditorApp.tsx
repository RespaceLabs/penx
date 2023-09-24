import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { Provider } from 'jotai'
import { useWorkers } from '@penx/hooks'
import { JotaiNexus, store } from '@penx/store'
import { ClientOnly } from './components/ClientOnly'
import { EditorLayout } from './EditorLayout/EditorLayout'

export const EditorApp: FC<PropsWithChildren> = ({ children }) => {
  useWorkers()

  useEffect(() => {
    try {
      const codeString = `
      const openRequest = window.indexedDB.open('myDatabase22', 1)
    `

      const script = document.createElement('script')
      script.textContent = `

      try {
        ${codeString}
      } catch (error) {
        console.log('helooooooooooooo:', error)  
      }
      `
      document.body.appendChild(script)
    } catch (error) {
      console.log('e99----xxx:', error)
    }
  }, [])

  return (
    <ClientOnly>
      <Provider store={store}>
        <JotaiNexus />
        <EditorLayout />
      </Provider>
    </ClientOnly>
  )
}
