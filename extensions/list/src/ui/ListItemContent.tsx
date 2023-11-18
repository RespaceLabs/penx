import React, { CSSProperties, useState } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box } from '@fower/react'
import { Path, Transforms } from 'slate'
import { isCheckListItem } from '@penx/check-list'
import { ContextMenu, MenuItem, useContextMenu } from '@penx/context-menu'
import { TElement, useEditorStatic } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
import { ListContentElement } from '../types'
import { Bullet } from './Bullet'
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
  const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(child.type)

  function h() {
    return isHeading ? 'calc(1.8em + 8px)' : 'calc(1.5em + 8px)'
  }

  const menuId = `lic-menu-${element.id}`
  const { show } = useContextMenu(menuId)

  function handleItemClick(type: string) {
    if (type === 'DELETE') {
      Transforms.removeNodes(editor, { at: Path.parent(path) })
    }
  }
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

    const node = editor.flattenedItems.find(({ id }) => id === element.id)

    const { projected } = editor

    const isNextDepth = projected?.depth !== node?.depth

    const isAfter = overIndex > activeIndex
    const style = {
      left: isNextDepth ? 20 : -10,
      // left: -10,
      right: 0,
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
        text3XL={child.type === 'h1'}
        text2XL={child.type === 'h2'}
        textXL={child.type === 'h3'}
        textLG={child.type === 'h4'}
      >
        <ContextMenu id={menuId}>
          <MenuItem onClick={() => handleItemClick('a')}>
            Add to favorite
          </MenuItem>
          <MenuItem onClick={() => handleItemClick('b')}>Publish</MenuItem>
          <MenuItem onClick={() => handleItemClick('c')}>Copy</MenuItem>
          <MenuItem onClick={() => handleItemClick('DELETE')}>Delete</MenuItem>
          <MenuItem onClick={() => handleItemClick('d')}>Expand all</MenuItem>
          <MenuItem onClick={() => handleItemClick('f')}>Collapse all</MenuItem>
        </ContextMenu>
        <Chevron element={element} onContextMenu={show} />

        {/* <Bullet element={element} onContextMenu={show} /> */}

        {/* disable drag now */}
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
