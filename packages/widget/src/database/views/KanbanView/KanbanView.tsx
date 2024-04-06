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
import { useDatabaseContext } from '../../DatabaseContext'
import { Container, ContainerProps, Item } from './components'
import { DroppableContainer } from './DroppableContainer'
import { KanbanContainerItem } from './KanbanContainerItem'
import { coordinateGetter as multipleContainersCoordinateGetter } from './multipleContainersKeyboardCoordinates'
import { SortableItem } from './SortableItem'
import { Trash } from './Trash'

type UniqueIdentifier = string

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>

interface Props {
  cancelDrop?: CancelDrop
  containerStyle?: React.CSSProperties
  coordinateGetter?: KeyboardCoordinateGetter
  getItemStyles?(args: {
    value: UniqueIdentifier
    index: number
    overIndex: number
    isDragging: boolean
    containerId: UniqueIdentifier
    isSorting: boolean
    isDragOverlay: boolean
  }): React.CSSProperties
  wrapperStyle?(args: { index: number }): React.CSSProperties
  itemCount?: number
  handle?: boolean
  modifiers?: Modifiers
  trashable?: boolean
  scrollable?: boolean
}

export const TRASH_ID = 'void'
const PLACEHOLDER_ID = 'placeholder'
const empty: UniqueIdentifier[] = []

export function KanbanView({
  cancelDrop,
  handle = false,
  coordinateGetter = multipleContainersCoordinateGetter,
  getItemStyles = () => ({}),
  wrapperStyle = () => ({}),
  modifiers,
  trashable = false,
  scrollable,
}: Props) {
  const { currentView, rows, options, columns, cells } = useDatabaseContext()

  console.log('==============rows:', rows)

  const [items, setItems] = useState<Items>(() => {
    const { kanbanColumnId, kanbanOptionIds } = currentView.props

    return kanbanOptionIds.reduce((acc, id) => {
      acc[id] = rows
        .filter((row) => {
          const rowCells = columns.map((column) => {
            return cells.find(
              (cell) =>
                cell.props.rowId === row.id &&
                cell.props.columnId === column?.id,
            )!
          })

          const item = rowCells.find((cell) => {
            return (
              id === cell.props.data[0] &&
              cell.props.columnId === kanbanColumnId
            )
          })

          return !!item
        })
        .map((row) => {
          return row.id
        })

      return acc
    }, {} as Items)
  })

  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[],
  )

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)
  const isSortingContainer = activeId ? containers.includes(activeId) : false

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items,
          ),
        })
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args)
      let overId = getFirstCollision(intersections, 'id')

      if (overId != null) {
        if (overId === TRASH_ID) {
          // If the intersecting droppable is the trash, return early
          // Remove this if you're not using trashable functionality in your app
          return intersections
        }

        if (overId in items) {
          const containerItems = items[overId]

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id as any),
              ),
            })[0]?.id
          }
        }

        lastOverId.current = overId as any

        return [{ id: overId }]
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, items],
  )
  const [clonedItems, setClonedItems] = useState<Items | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    }),
  )
  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id
    }

    return Object.keys(items).find((key) => items[key].includes(id))
  }

  const getIndex = (id: UniqueIdentifier) => {
    const container = findContainer(id)

    if (!container) {
      return -1
    }

    const index = items[container].indexOf(id)

    return index
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [items])

  function onDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as any)
    setClonedItems(items)
  }

  function onDragMove(event: DragMoveEvent) {
    //
  }

  function onDragOver({ active, over }: DragOverEvent) {
    const overId = over?.id

    if (overId == null || overId === TRASH_ID || active.id in items) {
      return
    }

    const overContainer = findContainer(overId as string)
    const activeContainer = findContainer(active.id as string)

    if (!overContainer || !activeContainer) {
      return
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeItems = items[activeContainer]
        const overItems = items[overContainer]
        const overIndex = overItems.indexOf(overId as string)
        const activeIndex = activeItems.indexOf(active.id as string)

        let newIndex: number

        if (overId in items) {
          newIndex = overItems.length + 1
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height

          const modifier = isBelowOverItem ? 1 : 0

          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1
        }

        recentlyMovedToNewContainer.current = true

        return {
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (item) => item !== active.id,
          ),
          [overContainer]: [
            ...items[overContainer].slice(0, newIndex),
            items[activeContainer][activeIndex],
            ...items[overContainer].slice(
              newIndex,
              items[overContainer].length,
            ),
          ],
        }
      })
    }
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    // drag container
    if (active.id in items && over?.id) {
      setContainers((containers) => {
        const activeIndex = containers.indexOf(active.id as string)
        const overIndex = containers.indexOf(over.id as string)

        return arrayMove(containers, activeIndex, overIndex)
      })
    }

    const activeContainer = findContainer(active.id as string)

    if (!activeContainer) {
      setActiveId(null)
      return
    }

    const overId = over?.id as string

    if (overId == null) {
      setActiveId(null)
      return
    }

    if (overId === TRASH_ID) {
      setItems((items) => ({
        ...items,
        [activeContainer]: items[activeContainer].filter(
          (id) => id !== activeId,
        ),
      }))
      setActiveId(null)
      return
    }

    if (overId === PLACEHOLDER_ID) {
      const newContainerId = getNextContainerId()

      unstable_batchedUpdates(() => {
        setContainers((containers) => [...containers, newContainerId])
        setItems(
          (items) =>
            ({
              ...items,
              [activeContainer]: items[activeContainer].filter(
                (id) => id !== activeId,
              ),
              [newContainerId]: [active.id],
            }) as any,
        )
        setActiveId(null)
      })
      return
    }

    const overContainer = findContainer(overId)

    if (overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id as string)
      const overIndex = items[overContainer].indexOf(overId)

      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex,
          ),
        }))
      }
    }

    setActiveId(null)
  }

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems)
    }

    setActiveId(null)
    setClonedItems(null)
  }

  function renderSortableItemDragOverlay(id: UniqueIdentifier) {
    return (
      <Item
        value={id}
        cells={[]}
        handle={handle}
        style={getItemStyles({
          containerId: findContainer(id) as UniqueIdentifier,
          overIndex: -1,
          index: getIndex(id),
          value: id,
          isSorting: true,
          isDragging: true,
          isDragOverlay: true,
        })}
        wrapperStyle={wrapperStyle({ index: 0 })}
        dragOverlay
      />
    )
  }

  function renderContainerDragOverlay(containerId: UniqueIdentifier) {
    return (
      <Container
        label={`Column ${containerId}`}
        items={[]}
        style={{
          height: '100%',
        }}
        shadow
      >
        {items[containerId].map((item, index) => (
          <Item
            key={item}
            value={item}
            handle={handle}
            cells={[]}
            style={getItemStyles({
              containerId,
              overIndex: -1,
              index: getIndex(item),
              value: item,
              isDragging: false,
              isSorting: false,
              isDragOverlay: false,
            })}
            wrapperStyle={wrapperStyle({ index })}
          />
        ))}
      </Container>
    )
  }

  function handleRemove(containerId: UniqueIdentifier) {
    setContainers((containers) => containers.filter((id) => id !== containerId))
  }

  function handleAddColumn() {
    const newContainerId = getNextContainerId()

    unstable_batchedUpdates(() => {
      setContainers((containers) => [...containers, newContainerId])
      setItems((items) => ({
        ...items,
        [newContainerId]: [],
      }))
    })
  }

  function getNextContainerId() {
    const containerIds = Object.keys(items)
    const lastContainerId = containerIds[containerIds.length - 1]

    return String.fromCharCode(lastContainerId.charCodeAt(0) + 1)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      cancelDrop={cancelDrop}
      onDragCancel={onDragCancel}
      modifiers={modifiers}
    >
      <Box
        style={{
          display: 'inline-grid',
          gridAutoFlow: 'column',
        }}
      >
        <SortableContext
          items={[...containers, PLACEHOLDER_ID]}
          strategy={horizontalListSortingStrategy}
        >
          {containers.map((containerId) => {
            const option = options.find((option) => option.id === containerId)!

            return (
              <KanbanContainerItem
                key={containerId}
                containerId={containerId}
                scrollable={scrollable}
                option={option}
                items={items[containerId]}
                isSortingContainer={isSortingContainer}
                handleRemove={handleRemove}
                getIndex={getIndex}
                getItemStyles={getItemStyles}
                wrapperStyle={wrapperStyle}
              />
            )
          })}
          <DroppableContainer
            id={PLACEHOLDER_ID}
            disabled={isSortingContainer}
            items={empty}
            onClick={handleAddColumn}
            placeholder
          >
            + Add column
          </DroppableContainer>
        </SortableContext>
      </Box>
      {createPortal(
        <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
          {activeId
            ? containers.includes(activeId)
              ? renderContainerDragOverlay(activeId)
              : renderSortableItemDragOverlay(activeId)
            : null}
        </DragOverlay>,
        document.body,
      )}
      {trashable && activeId && !containers.includes(activeId) ? (
        <Trash id={TRASH_ID} />
      ) : null}
    </DndContext>
  )
}
