import React, { useEffect, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { ICellNode } from '@penx/model-types'
import { Item } from './components'

type UniqueIdentifier = string

interface SortableItemProps {
  containerId: UniqueIdentifier
  id: UniqueIdentifier
  cells: ICellNode[]
  index: number
  handle: boolean
  disabled?: boolean
  style(args: any): React.CSSProperties
  getIndex(id: UniqueIdentifier): number
  wrapperStyle({ index }: { index: number }): React.CSSProperties
}

export function SortableItem({
  disabled,
  id,
  index,
  handle,
  style,
  cells,
  containerId,
  getIndex,
  wrapperStyle,
}: SortableItemProps) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    isDragging,
    isSorting,
    over,
    overIndex,
    transform,
    transition,
  } = useSortable({
    id,
  })
  const mounted = useMountStatus()
  const mountedWhileDragging = isDragging && !mounted

  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      value={id}
      cells={cells}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
      index={index}
      wrapperStyle={wrapperStyle({ index })}
      style={style({
        index,
        value: id,
        isDragging,
        isSorting,
        overIndex: over ? getIndex(over.id as string) : overIndex,
        containerId,
      })}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
    />
  )
}

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500)

    return () => clearTimeout(timeout)
  }, [])

  return isMounted
}
