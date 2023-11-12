import { Box } from '@fower/react'
import { useSlateStatic } from 'slate-react'
import { findNodePath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
import { ListItemElement } from '../types'
import { GuideLine } from './GuideLine'

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
      {path.length > 2 && <GuideLine />}
      {children}
    </Box>
  )
}
