import React, { CSSProperties, useState } from 'react'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CSSObject } from '@fower/react'
import { Node, WithFlattenedProps } from '@penx/model'
import { TreeItem } from './TreeItem'
import { FlattenedItem } from './types'

interface Props {
  depth: number
  overDepth: number // projected depth
  item: FlattenedItem
  onCollapse?: () => void
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true)

export function SortableTreeItem({
  item,
  depth,
  overDepth,
  onCollapse,
}: Props) {
  const sortable = useSortable({
    id: item.id,
    animateLayoutChanges,
  })

  const {
    over,
    active,
    overIndex,
    activeIndex,
    attributes,
    isDragging,
    isSorting,
    isOver,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    setNodeRef,
    transform,
    transition,
  } = sortable

  const { id } = item

  // console.log('overIndex:', overIndex, 'activeIndex:', activeIndex)

  function getActiveStyle() {
    if (!over || !active) return {}
    if (id !== over.id) return {}
    // if (node.hasChildren) return {}

    const isAfter = overIndex > activeIndex

    const style: CSSObject = {
      left: overDepth * 20,
      right: 0,
      top0: !isAfter,
      bottom0: isAfter,
      content: '""',
      position: 'absolute',
      h: 3,
      // w: '100%',
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

  // console.log('style:', style)

  return (
    <TreeItem
      ref={sortable.setNodeRef}
      item={item}
      depth={depth}
      listeners={sortable.listeners}
      style={style}
      css={getActiveStyle()}
      onCollapse={onCollapse}
    />
  )
}
