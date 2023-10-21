import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { ELEMENT_UL, ListElement } from '../types'

export const List = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps<ListElement>) => {
  const type = element.type === ELEMENT_UL ? 'ul' : 'ol'

  return (
    <Box as={type} {...attributes} m0 pl6 {...nodeProps}>
      {children}
    </Box>
  )
}
