import { Box } from '@fower/react'
import { Node, Path } from 'slate'
import { useEditorStatic } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'

export const Paragraph = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps) => {
  const editor = useEditorStatic()
  const path = findNodePath(editor, element)!
  const parent = Path.parent(path)
  const node: any = getNodeByPath(editor, parent)

  const isInTitle = node?.type === 'title'

  // console.log('render.......', Node.string(element))

  return (
    <Box
      leadingNormal
      gray900
      textBase={!isInTitle}
      relative
      {...attributes}
      {...nodeProps}
    >
      {children}
    </Box>
  )
}
