import React, { CSSProperties, memo } from 'react'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ElementProps } from '@penx/extension-typings'
import { ListContentElement } from '../types'
import { ListItemContent } from './ListItemContent'

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true)

export const SortableListItemContent = memo(function SortableListItemContent(
  props: ElementProps<ListContentElement>,
) {
  const { element } = props
  const { id } = element

  const sortable = useSortable({
    id: id,
    animateLayoutChanges,
  })

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
    <ListItemContent
      ref={sortable.setNodeRef}
      css={getActiveStyle()}
      style={style}
      listeners={sortable.listeners}
      {...props}
    />
  )
})
