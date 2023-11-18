import React, { CSSProperties } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box } from '@fower/react'
import { isCheckListItem } from '@penx/check-list'
import { useContextMenu } from '@penx/context-menu'
import { TElement, useEditorStatic } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
import { ListContentElement } from '../types'
import { Bullet } from './Bullet'
import { BulletMenu } from './BulletMenu'
import { Chevron } from './Chevron'

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true)

export const ListItemContent = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps<ListContentElement>) => {
  const editor = useEditorStatic()
  const path = findNodePath(editor, element)!
  const child = getNodeByPath(editor, [...path, 0]) as TElement
  const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(child?.type)

  function h() {
    return isHeading ? 'calc(1.8em + 8px)' : 'calc(1.5em + 8px)'
  }

  const menuId = `lic-menu-${element.id}`
  const { show } = useContextMenu(menuId)

  const { id } = element

  const sortable = useSortable({
    id: id,
    animateLayoutChanges,
  })

  const isTask = isCheckListItem(child)

  const {
    over,
    active,
    overIndex,
    activeIndex,
    isDragging,
    isSorting,
    items,
    data,
    isOver,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    setNodeRef,
    transform,
    transition,
  } = sortable

  function getActiveStyle() {
    if (!over || !active) return {}
    if (id !== over.id) return {}

    const isAfter = overIndex > activeIndex

    const style = {
      left: -10,
      right: 0,
      // top: 0,
      top0: !isAfter,
      bottom0: isAfter,
      content: '""',
      position: 'absolute',
      h: 3,
      bgBrand300: true,
    }
    return {
      '::after': style,
    }
  }

  const style: CSSProperties = {
    transform: isSorting ? undefined : CSS.Translate.toString(transform),
    transition,
  }

  return (
    <Box
      {...attributes}
      ref={mergeRefs([sortable.setNodeRef, attributes.ref])}
      data-type="list-item-content"
      m0
      leadingNormal
      textBase
      relative
      toTop={!isTask}
      px1
      py-2
      gap2
      {...nodeProps}
      css={getActiveStyle()}
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
        flexShrink-1
        gap-2
        leadingNormal
        h={h()}
        textSM
        text3XL={child?.type === 'h1'}
        text2XL={child?.type === 'h2'}
        textXL={child?.type === 'h3'}
        textLG={child?.type === 'h4'}
      >
        <BulletMenu menuId={menuId} element={element} />

        <Chevron element={element} onContextMenu={show} />

        {/* <Bullet element={element} onContextMenu={show} /> */}

        <Box inlineFlex {...sortable.listeners}>
          <Bullet element={element} onContextMenu={show} />
        </Box>
      </Box>

      <Box flex-1 pl1 leadingNormal>
        {children}
      </Box>
    </Box>
  )
}
