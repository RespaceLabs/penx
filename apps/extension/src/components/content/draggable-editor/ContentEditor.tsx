import { Box } from '@fower/react'
import { produce } from 'immer'
import { PropsWithChildren, useEffect, useState } from 'react'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_P, ELEMENT_UL } from '@penx/constants'
import { QuickInputEditor } from '@penx/editor'
import { ExtensionContext } from '@penx/extension-typings'
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
                children: [{ text: 'foo bar...' }],
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
        <Box px2>
          <QuickInputEditor plugins={[]} content={content} />
        </Box>
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

  return <Box>{children}</Box>
}
