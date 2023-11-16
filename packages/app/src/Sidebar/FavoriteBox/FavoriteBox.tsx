import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import isEqual from 'react-fast-compare'
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
import { CSS } from '@dnd-kit/utilities'
import { Box } from '@fower/react'
import { useNodes, useSpaces } from '@penx/hooks'
import { FavoriteTitle } from './FavoriteTitle'
import { NodeItem } from './NodeItem'
import { SortableNodeItem } from './SortableNodeItem'

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

export const FavoriteBox = () => {
  const { nodeList } = useNodes()
  const { favoriteNode } = nodeList
  const nodes = nodeList.getFavorites()
  const [items, setItems] = useState(favoriteNode.children)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!isEqual(items, favoriteNode.children)) {
      setItems(favoriteNode.children)
    }
  }, [items, favoriteNode.children])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (active) {
      setActiveId(active.id as string)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const overId = event.over?.id
    const activeIndex = items.indexOf(activeId as string)
    const overIndex = items.indexOf(overId as string)
    const clonedItems: string[] = JSON.parse(JSON.stringify(items))
    const newItems = arrayMove(clonedItems, activeIndex, overIndex)

    setItems(newItems)
    await nodeList.updateFavoriteNode(favoriteNode.id, {
      children: newItems,
    })
    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeItem = activeId ? nodes.find(({ id }) => id === activeId) : null

  if (!isEqual(items, favoriteNode.children)) return null

  return (
    <Box>
      <FavoriteTitle />

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <Box column>
            {items.map((id) => {
              const node = nodeList.getNode(id)
              return <SortableNodeItem key={node.id} node={node} />
            })}
          </Box>
        </SortableContext>
        {createPortal(
          <DragOverlay adjustScale={false}>
            {activeId && activeItem && (
              <NodeItem node={activeItem} opacity-40 />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </Box>
  )
}
