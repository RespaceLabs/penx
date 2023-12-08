import React, { CSSProperties, forwardRef, memo } from 'react'
import isEqual from 'react-fast-compare'
import { mergeRefs } from 'react-merge-refs'
import { useSortable } from '@dnd-kit/sortable'
import { Box, CSSObject } from '@fower/react'
import { Node } from 'slate'
import { isCheckListItem } from '@penx/check-list'
import { useContextMenu } from '@penx/context-menu'
import { TElement, useEditorStatic } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
import { ListContentElement } from '../types'
import { Bullet } from './Bullet'
import { BulletMenu } from './BulletMenu'
import { Chevron } from './Chevron'

interface Props extends ElementProps<ListContentElement> {
  style?: CSSProperties
  css?: CSSObject
  listeners?: ReturnType<typeof useSortable>['listeners']
}

export const ListItemContent = memo(
  forwardRef<HTMLDivElement, Props>(function ListItemContent(
    {
      attributes,
      element,
      children,
      nodeProps,
      css = {},
      style = {},
      listeners,
    },
    ref,
  ) {
    const editor = useEditorStatic()
    const path = findNodePath(editor, element)!
    const child = getNodeByPath(editor, [...path, 0]) as TElement
    const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(child?.type)

    function h() {
      return isHeading ? 'calc(1.8em + 8px)' : 'calc(1.5em + 8px)'
    }

    // console.log('element', element)

    const menuId = `lic-menu-${element.id}`
    const { show } = useContextMenu(menuId)
    const isTask = isCheckListItem(child)

    // console.log('render.......', Node.string(element))

    return (
      <Box
        {...attributes}
        ref={mergeRefs([ref, attributes.ref])}
        data-type="list-item-content"
        m0
        leadingNormal
        textBase
        relative
        toTop={!isTask}
        px1
        py-2
        {...nodeProps}
        css={css}
        style={style}
        className="nodeContent"
      >
        <Box
          absolute
          top-0={!isTask}
          top--1={isTask}
          w-40
          left--40
          contentEditable={false}
          toCenterY
          toRight
          // flexShrink-0
          gap-2
          leadingNormal
          h={h()}
          textSM
          text3XL={child?.type === 'h1'}
          text2XL={child?.type === 'h2'}
          textXL={child?.type === 'h3'}
          textLG={child?.type === 'h4'}
          style={{
            userSelect: 'none',
          }}
        >
          <BulletMenu menuId={menuId} element={element} />

          <Chevron element={element} onContextMenu={show} />

          <Box inlineFlex {...listeners}>
            <Bullet element={element} onContextMenu={show} />
          </Box>
        </Box>

        <Box flex-1 pl1 leadingNormal>
          {children}
        </Box>
      </Box>
    )
  }),

  (prev, next) => {
    const {
      element: a1,
      css: b1,
      style: c1,
      nodeProps: d1,
      children: f1,
    } = prev
    const {
      element: a2,
      css: b2,
      style: c2,
      nodeProps: d2,
      children: f2,
    } = next

    const equal =
      isEqual(a1, a2) &&
      isEqual(b1, b2) &&
      isEqual(c1, c2) &&
      isEqual(d1, d2) &&
      isEqual(f1, f2)

    return equal
  },
)
