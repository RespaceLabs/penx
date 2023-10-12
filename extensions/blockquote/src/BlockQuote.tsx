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
      my0
      mx0
      pl2
      py0
      h="1.5em"
      relative
      {...attributes}
      {...nodeProps}
    >
      {children}
    </Box>
  )
}
