import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal, unstable_batchedUpdates } from 'react-dom'
import {
  CancelDrop,
  closestCenter,
  CollisionDetection,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  getFirstCollision,
  KeyboardCoordinateGetter,
  KeyboardSensor,
  MeasuringStrategy,
  Modifiers,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  SortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box } from '@fower/react'
import { IOptionNode } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'
import { Container, ContainerProps, Item } from './components'
import { DroppableContainer } from './DroppableContainer'
import { coordinateGetter as multipleContainersCoordinateGetter } from './multipleContainersKeyboardCoordinates'
import { SortableItem } from './SortableItem'
import { Trash } from './Trash'

type UniqueIdentifier = string

interface KanbanContainerItemProps {
  containerId: string
  option?: IOptionNode
  items: string[]
  scrollable?: boolean
  isSortingContainer: boolean

  getItemStyles(args: {
    value: UniqueIdentifier
    index: number
    overIndex: number
    isDragging: boolean
    containerId: UniqueIdentifier
    isSorting: boolean
    isDragOverlay: boolean
  }): React.CSSProperties
  wrapperStyle(args: { index: number }): React.CSSProperties

  handleRemove: (containerId: UniqueIdentifier) => void
  getIndex: (id: UniqueIdentifier) => number
}

export function KanbanContainerItem({
  containerId,
  option,
  items,
  handleRemove,
  scrollable,
  isSortingContainer,
  getIndex,
  getItemStyles,
  wrapperStyle,
}: KanbanContainerItemProps) {
  const { currentView, columns, cells } = useDatabaseContext()

  let { viewColumns = [] } = currentView.props

  return (
    <DroppableContainer
      key={containerId}
      id={containerId}
      label={option?.props?.name}
      color={option?.props?.color}
      items={items}
      scrollable={scrollable}
      onRemove={() => handleRemove(containerId)}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((value, index) => {
          const sortedColumns = viewColumns.map(({ columnId }) => {
            return columns.find((col) => col.id === columnId)!
          })

          const sortedCell = sortedColumns.map((column) => {
            return cells.find(
              (cell) =>
                cell.props.rowId === value &&
                cell.props.columnId === column?.id,
            )!
          })

          return (
            <SortableItem
              disabled={isSortingContainer}
              key={value}
              cells={sortedCell}
              id={value}
              index={index}
              handle={false}
              style={getItemStyles}
              wrapperStyle={wrapperStyle}
              containerId={containerId}
              getIndex={getIndex}
            />
          )
        })}
      </SortableContext>
    </DroppableContainer>
  )
}
