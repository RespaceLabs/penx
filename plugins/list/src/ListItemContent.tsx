import { Box } from '@fower/react'
import { ElementProps } from '@penx/plugin-typings'
import { ListContentElement } from '../custom-types'

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
