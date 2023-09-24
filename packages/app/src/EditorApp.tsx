import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { Provider } from 'jotai'
import { isServer } from '@penx/constants'
import { useWorkers } from '@penx/hooks'
import { db } from '@penx/local-db'
import { JotaiNexus, store } from '@penx/store'
import { ClientOnly } from './components/ClientOnly'
import { EditorLayout } from './EditorLayout/EditorLayout'
import { penx } from './penx'

if (!isServer) {
  window.penx = penx as any

  window.onload = async () => {
    const plugins = await db.listPlugins()

    console.log('init plugin===========:', plugins)
    for (const item of plugins) {
      // eval(`
      // ${item.code}
      //   activate(Object.create(window.penx, {
      //     pluginId: {
      //         writable: false,
      //         configurable: false,
      //         value: "${item.manifest.id}"
      //       }
      //   }))
      // `)

      const script = document.createElement('script')
      script.type = 'module'
      script.innerHTML = `
        ${item.code}
        activate(Object.create(window.penx, {
          pluginId: {
              writable: false,
              configurable: false,
              value: "${item.manifest.id}"
            }
        }))
      `
      document.body.appendChild(script)
    }
  }
}

export const EditorApp: FC<PropsWithChildren> = ({ children }) => {
  useWorkers()

  useEffect(() => {
    persist()
      .then((d) => {
        console.log('set persist......', d)
      })
      .catch((e) => {
        console.log('set persist......error', e)
      })
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

async function persist() {
  console.log('navigator.storage:', navigator.storage)

  if (navigator.storage && navigator.storage.persist) {
    return navigator.storage.persist()
  }
}
