import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { BlockquoteElement } from './types'

export const Blockquote = ({
  attributes,
  children,
  nodeProps,
}: ElementProps<BlockquoteElement>) => {
  return (
    <Box
      as="blockquote"
      borderLeft-3
      borderGray300
      textBase
      leadingSnug
      m0
      mt0
      mb4
      pl2
      py0
      relative
      {...attributes}
      {...nodeProps}
    >
      {children}
    </Box>
  )
}
