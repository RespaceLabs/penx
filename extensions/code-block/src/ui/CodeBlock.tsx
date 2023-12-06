import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { CodeBlockElement } from '../types'
import { CodeBlockHeader } from './CodeBlockHeader'
import { CodeBlockProvider } from './CodeBlockProvider'

export const CodeBlock = ({
  attributes,
  children,
  element,
}: ElementProps<CodeBlockElement>) => {
  return (
    <CodeBlockProvider>
      <Box
        bgGray100
        rounded
        leadingNormal
        my2
        transitionCommon
        flex-1
        {...attributes}
      >
        <CodeBlockHeader element={element} />
        <Box pb6 textSM>
          {children}
        </Box>
      </Box>
    </CodeBlockProvider>
  )
}
