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
  const parentNode = Node.parent(editor, path) as Element

  const nodes = Path.ancestors(path).filter((p) => {
    const node = Node.get(editor, p) as Element
    return isListElement(node)
  })

  const level = nodes.length % 3
  const isOrdered = isOrderedListElement(parentNode)

  return (
    <Box
      as="li"
      {...attributes}
      {...nodeProps}
      m0
      css={{
        listStyleType: () => {
          if (level === 1) return isOrdered ? 'decimal' : 'disc'
          if (level === 2) return isOrdered ? 'lower-alpha' : 'circle'
          if (level === 0) return isOrdered ? 'lower-roman' : 'square'
          return 'none'
        },
      }}
    >
      {children}
    </Box>
  )
}
