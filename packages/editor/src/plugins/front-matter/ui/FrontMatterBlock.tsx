import { Box } from '@fower/react'
import { ElementProps, FrontMatterBlockElement } from '@penx/editor-types'
import { FrontMatterHeader } from './FrontMatterHeader'

export const FrontMatterBlock = ({
  attributes,
  children,
  element,
}: ElementProps<FrontMatterBlockElement>) => {
  return (
    <Box
      bgGray100
      rounded
      leadingNormal
      my2
      transitionCommon
      flex-1
      {...attributes}
    >
      <FrontMatterHeader element={element} />
      <Box pb6>{children}</Box>
    </Box>
  )
}
