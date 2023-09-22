import { Box } from '@fower/react'
import { ElementProps, ListContentElement } from '@penx/editor-types'

export const ListItemContent = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps<ListContentElement>) => {
  return (
    <Box
      {...attributes}
      m0
      leadingNormal
      textBase
      relative
      flex-1
      py1
      {...nodeProps}
    >
      {children}
    </Box>
  )
}
