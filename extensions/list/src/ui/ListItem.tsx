import { Box } from '@fower/react'
import { Element, Node, Path } from 'slate'
import { useSlateStatic } from 'slate-react'
import { findNodePath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
import { isListElement, isOrderedListElement } from '../guard'
import { ListItemElement } from '../types'

export const ListItem = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps<ListItemElement>) => {
  const editor = useSlateStatic()
  const path = findNodePath(editor, element)!

  return (
    <Box
      data-type="list-item"
      {...attributes}
      {...nodeProps}
      m0
      relative
      pl0={path.length > 2}
    >
      {path.length > 2 && (
        <Box
          contentEditable={false}
          absolute
          left--40
          top0
          bottom0
          bgGray200
          w-1
        />
      )}
      {children}
    </Box>
  )
}
