import { Box } from '@fower/react'
import { Path } from 'slate'
import { useSlate } from 'slate-react'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'

export const Paragraph = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps) => {
  const editor = useSlate()
  const path = findNodePath(editor, element)!
  const parent = Path.parent(path)
  const node: any = getNodeByPath(editor, parent)

  const isInTitle = node?.type === 'title'

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
