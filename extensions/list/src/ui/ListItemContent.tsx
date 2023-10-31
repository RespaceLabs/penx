import { Box } from '@fower/react'
import { TElement, useEditor } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
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
  const child = getNodeByPath(editor, [...path, 0]) as TElement
  const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(child.type)

  function h() {
    return isHeading ? 'calc(1.8em + 8px)' : 'calc(1.5em + 8px)'
  }

  return (
    <Box
      {...attributes}
      data-type="list-item-content"
      m0
      leadingNormal
      textBase
      relative
      toTop
      p1
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
        flexShrink-1
        gap-2
        leadingNormal
        h={h()}
        textSM
        text3XL={child.type === 'h1'}
        text2XL={child.type === 'h2'}
        textXL={child.type === 'h3'}
        textLG={child.type === 'h4'}
      >
        <Chevron element={element} />
        <Bullet element={element} />
      </Box>
      <Box flex-1 pl1 leadingNormal>
        {children}
      </Box>
    </Box>
  )
}
