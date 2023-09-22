import { Box } from '@fower/react'
import { CodeBlockElement, ElementProps } from '@penx/editor-types'
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
        <Box pb6>{children}</Box>
      </Box>
    </CodeBlockProvider>
  )
}
