import { Box } from '@fower/react'
import { useEditor } from '@penx/editor-common'
import { findNodePath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
import { useCollapsed } from '../hooks/useCollapsed'
import { ListElement } from '../types'

export const List = ({
  attributes,
  children,
  element,
  nodeProps,
}: ElementProps<ListElement>) => {
  const editor = useEditor()
  const collapsed = useCollapsed(element)

  const path = findNodePath(editor, element)!
  const isRootList = path.length === 1

  return (
    <Box
      data-type="list"
      {...attributes}
      {...nodeProps}
      mr0
      ml0
      pl8
      ml--10={isRootList && !editor.isOutliner}
    >
      <Box hidden={collapsed}>{children}</Box>
    </Box>
  )
}
