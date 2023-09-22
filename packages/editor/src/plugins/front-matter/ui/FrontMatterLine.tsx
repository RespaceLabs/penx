import { Box } from '@fower/react'
import { ElementProps, FrontMatterLineElement } from '@penx/editor-types'

export const FrontMatterLine = ({
  attributes,
  element,
  children,
}: ElementProps<FrontMatterLineElement>) => {
  return (
    <Box fontMono flex-1 toCenterY gapX2 px5 w-100p h5 {...attributes}>
      <Box flex-1>{children}</Box>
    </Box>
  )
}
