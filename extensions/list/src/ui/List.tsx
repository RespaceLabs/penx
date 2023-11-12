import { Box } from '@fower/react'
import { useEditor } from '@penx/editor-common'
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

  return (
    <Box
      data-type="list"
      {...attributes}
      m0
      pl8
      {...nodeProps}
      bgRed100={collapsed}
    >
      <Box hidden={collapsed}>{children}</Box>
    </Box>
  )
}
