import { Box } from '@fower/react'
import { ElementType } from '@penx/editor-shared'
import { ElementProps, ListElement } from '@penx/editor-types'

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
