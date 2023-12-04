import { Box } from '@fower/react'
import { PropsWithChildren, useEffect, useState } from 'react'

import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_P, ELEMENT_UL } from '@penx/constants'
import { QuickInputEditor } from '@penx/editor'
import { useExtensionStore } from '@penx/hooks'
import { StoreProvider } from '@penx/store'

import { extensionList } from './extensionList'
import { penx } from './penx'

const content = [
  {
    type: ELEMENT_UL,
    children: [
      {
        type: ELEMENT_LI,
        children: [
          {
            type: ELEMENT_LIC,
            children: [
              {
                type: 'p',
                children: [{ text: '' }],
              },
            ],
          },
        ],
      },
    ],
  },
]

export const ContentEditor = () => {
  return (
    <StoreProvider>
      <ExtensionLoader>
        <QuickInputEditor plugins={[]} content={content} />
      </ExtensionLoader>
    </StoreProvider>
  )
}

function ExtensionLoader({ children }: PropsWithChildren) {
  const { extensionStore } = useExtensionStore()
  useEffect(() => {
    for (const item of extensionList) {
      const ctx = Object.create(penx, {
        pluginId: {
          writable: false,
          configurable: false,
          value: item.id,
        },
      })
      item.activate(ctx)
    }
  }, [])

  if (!extensionStore.withFns.length) return null

  return <>{children}</>
}
