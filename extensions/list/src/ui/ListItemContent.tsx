import { useMemo } from 'react'
import { Box } from '@fower/react'
import { Node, Path } from 'slate'
import { useSlate } from 'slate-react'
import { useEditor } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
import { isListElement } from '../guard'
import { ListContentElement } from '../types'
import { Bullet } from './Bullet'
import { Chevron } from './Chevron'

export const ListItemContent = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps<ListContentElement>) => {
  const editor = useEditor()
  const path = findNodePath(editor, element)!

  const isChevronVisible = useMemo(() => {
    const prevPath = Path.next(path)
    const node = getNodeByPath(editor, prevPath)!
    if (isListElement(node)) return true
    return false
  }, [path, editor])

  return (
    <Box
      {...attributes}
      data-type="list-item-content"
      m0
      leadingNormal
      textBase
      relative
      py-2
      toTop
      gap2
      {...nodeProps}
      className="nodeContent"
    >
      <Box
        absolute
        top-2
        w-40
        left--40
        contentEditable={false}
        toCenterY
        toRight
        gap-2
        h="1.5em"
        flexShrink-1
      >
        {isChevronVisible && <Chevron element={element} />}

        <Bullet element={element} />
      </Box>
      <Box flex-1 pl1>
        {children}
      </Box>
    </Box>
  )
}
