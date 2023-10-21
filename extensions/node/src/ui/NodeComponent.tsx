import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { NodeElement } from '../types'

export const NodeComponent = ({
  attributes,
  nodeProps,
  element,
  children,
}: ElementProps<NodeElement>) => {
  return (
    <Box
      py1
      leadingNormal
      gray900
      textBase
      relative
      {...attributes}
      {...nodeProps}
    >
      {children}
    </Box>
  )
}
