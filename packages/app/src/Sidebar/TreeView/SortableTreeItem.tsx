import React, { CSSProperties, useState } from 'react'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CSSObject } from '@fower/react'
import { Node } from '@penx/model'
import { WithFlattenedProps } from '@penx/service'
import { TreeItem } from './TreeItem'

interface Props {
  level: number
  overDepth: number // projected depth
  node: WithFlattenedProps<Node>
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true)

export function SortableTreeItem({ node, level, overDepth }: Props) {
  const sortable = useSortable({
    id: node.id,
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

  const { id } = node

  function getActiveStyle() {
    if (!over || !active) return {}
    if (id !== over.id) return {}
    if (node.hasChildren) return {}

    const isAfter = overIndex > activeIndex
    const style: CSSObject = {
      left: overDepth * 20,
      right: 0,
      top0: !isAfter,
      bottom0: isAfter,
      content: '""',
      position: 'absolute',
      h: 2,
      // w: '100%',
      bgBrand500: true,
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
      node={node}
      // level={node.depth}
      level={level}
      sortable={sortable}
      style={style}
      css={getActiveStyle()}
    />
  )
}
