import { Box } from '@fower/react'
import { ElementProps } from '@penx/plugin-typings'
import { ElementType, ListElement } from '../custom-types'

export const List = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps<ListElement>) => {
  const type = element.type === ElementType.ul ? 'ul' : 'ol'

  return (
    <Box as={type} {...attributes} m0 pl6 {...nodeProps}>
      {children}
    </Box>
  )
}
