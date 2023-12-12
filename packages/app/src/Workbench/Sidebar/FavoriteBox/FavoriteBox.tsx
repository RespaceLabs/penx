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
import { Box } from '@fower/react'
import { useDatabase } from '@penx/hooks'
import { db } from '@penx/local-db'
import { NodeListService } from '@penx/service'
import { store } from '@penx/store'
import { FavoriteTitle } from './FavoriteTitle'
import { NodeItem } from './NodeItem'
import { SortableNodeItem } from './SortableNodeItem'

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

interface Props {
  nodeList: NodeListService
}

export const FavoriteBox = ({ nodeList }: Props) => {
  const { favoriteNode } = nodeList
  const nodes = nodeList.getFavorites()
  const items = nodeList.favoriteNodeChildren
  const [activeId, setActiveId] = useState<string | null>(null)

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
    const newItems = arrayMove(items, activeIndex, overIndex)

    const newNodes = nodeList.nodes.map((node) => {
      if (!node.isFavorite) return { ...node.raw }
      return { ...node.raw, children: newItems }
    })

    store.node.setNodes(newNodes)

    await db.updateNode(favoriteNode.id, {
      children: newItems,
    })
    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeItem = activeId ? nodes.find(({ id }) => id === activeId) : null

  if (!items.length) return null

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
              if (!node) return null
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
