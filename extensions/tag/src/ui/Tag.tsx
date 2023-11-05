import { Box } from '@fower/react'
import { useSelected } from 'slate-react'
import { ElementProps } from '@penx/extension-typings'
import { TagElement } from '../types'

export const Tag = ({
  element,
  attributes,
  children,
}: ElementProps<TagElement>) => {
  let selected = useSelected()

  return (
    <Box
      {...attributes}
      toCenterY
      inlineFlex
      bgGray100
      py1
      px1
      rounded
      ringBrand500={selected}
    >
      {children}
      {element.name}
    </Box>
  )
}
