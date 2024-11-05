import React, { CSSProperties, useCallback, useMemo, useState } from 'react'
import { Node } from '@/lib/model'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { NodeItem } from './NodeItem'

interface Props {
  node: Node
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true)

export function SortableNodeItem({ node }: Props) {
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
    items,
    isOver,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    setNodeRef,
    transform,
    transition,
  } = sortable

  const { id } = node
  const overId = over?.id as string
  const activeId = active?.id as string

  const getActiveStyle = useCallback(() => {
    if (!overId || !activeId) return {}
    if (id !== overId) return {}
    if (overId === activeId) return {}

    const isAfter = overIndex > activeIndex

    const style: any = {
      left: 0,
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
  }, [activeId, overId, id, overIndex, activeIndex])

  const css = useMemo(() => {
    return getActiveStyle()
  }, [getActiveStyle])

  const style: CSSProperties = useMemo(
    () => ({
      transform: isSorting ? undefined : CSS.Translate.toString(transform),
      transition,
    }),
    [isSorting, transition, transform],
  )

  return (
    <NodeItem
      ref={sortable.setNodeRef}
      node={node}
      listeners={sortable.listeners}
      style={style}
      // css={css}
    />
  )
}
