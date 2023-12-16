import React, { FC, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MeasuringConfiguration,
  MeasuringStrategy,
  Modifier,
  MouseSensor,
  PointerSensor,
  SensorContext,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Box } from '@fower/react'
import { Button } from 'uikit'
import { useDatabaseContext } from '../../DatabaseContext'
import { Item } from './Item'
import { SortableItem } from './SortableItem'

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

export const HideFieldOverlay = () => {
  const { currentView } = useDatabaseContext()
  const [activeId, setActiveId] = useState<string | null>(null as any)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const viewColumns = currentView.props.columns
  console.log('==========viewColumns:', viewColumns)

  const items = viewColumns.map((column) => column.id)

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      //
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  // const activeItem = activeId ? nodes.find(({ id }) => id === activeId) : null
  const activeItem = false

  return (
    <Box bgWhite rounded-4 p2 w-200>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {viewColumns.map((viewColumn, index) => (
            <SortableItem
              key={viewColumn.id}
              index={index}
              id={viewColumn.id}
              viewColumn={viewColumn}
            />
          ))}
        </SortableContext>

        {createPortal(
          <DragOverlay adjustScale={false}>
            {activeId && activeItem && (
              // <NodeItem node={activeItem} opacity-40 />
              <Box>GOGO</Box>
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
      <Box toBetween mt2>
        <Button size={28}>Hide all</Button>
        <Button size={28}>Show all</Button>
      </Box>
    </Box>
  )
}
