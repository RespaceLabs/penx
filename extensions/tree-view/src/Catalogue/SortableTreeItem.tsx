import React, { CSSProperties, useState } from 'react'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CatalogueNode, WithFlattenProps } from '@penx/catalogue'
import { CatalogueItem } from './CatalogueItem'
import { RenameCatalogueInput } from './RenameCatalogueInput'

interface Props {
  item: WithFlattenProps<CatalogueNode>
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true)

export function SortableTreeItem({ item }: Props) {
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

  function getActiveStyle() {
    if (!over || !active) return {}
    if (id !== over.id) return {}
    if (over.id === active.id) return {}
    if (item.isGroup) return {}

    const isAfter = overIndex > activeIndex
    const style = {
      left: 0,
      right: 0,
      top0: !isAfter,
      bottom0: isAfter,
      content: '""',
      position: 'absolute',
      h: 2,
      w: '100%',
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

  const [isRenaming, setIsRenaming] = useState(false)

  if (isRenaming) {
    return <RenameCatalogueInput node={item} setIsRenaming={setIsRenaming} />
  }

  return (
    <CatalogueItem
      item={item}
      level={item.depth}
      sortable={sortable}
      style={style}
      css={getActiveStyle()}
    />
  )
}
