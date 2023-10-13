import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box } from '@fower/react'
import { produce } from 'immer'
import { CatalogueNode, CatalogueTree } from '@penx/catalogue'
import { useCatalogue } from '@penx/hooks'
import { CatalogueBody } from './CatalogueBody'
import { CatalogueBoxHeader } from './CatalogueBoxHeader'
import { CatalogueItem } from './CatalogueItem'
import { SortableTreeItem } from './SortableTreeItem'

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ]
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    })
  },
}

export type UniqueIdentifier = string | number

export const CatalogueBox = () => {
  const catalogue = useCatalogue()
  const { nodes, tree } = catalogue

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const flattenedItems = useMemo(() => {
    return tree.flatten(undefined, nodes)
  }, [nodes, tree])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null

  function renderCatalogue(nodes: CatalogueNode[], level = 0) {
    return nodes.map((node) => {
      const item = flattenedItems.find(({ id }) => id === node.id)!
      if (!node.children?.length) {
        return <SortableTreeItem key={node.id} item={item} />
      }
      return (
        <Box key={node.id}>
          <SortableTreeItem key={node.id} item={item} />
          <Box display={node.isFolded ? 'none' : 'block'}>
            {renderCatalogue(node.children, level + 1)}
          </Box>
        </Box>
      )
    })
  }

  return (
    <Box w-100p>
      <CatalogueBoxHeader />
      {/* <CatalogueBody /> */}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={flattenedItems}
          // strategy={verticalListSortingStrategy}
          strategy={rectSortingStrategy}
        >
          <Box column>{renderCatalogue(nodes || [], 0)}</Box>

          {/* {flattenedItems.map((item) => {
            return <SortableTreeItem key={item.id} item={item} />
          })} */}

          {createPortal(
            <DragOverlay
              adjustScale={false}
              dropAnimation={dropAnimationConfig}
            >
              {activeId && activeItem ? (
                <CatalogueItem
                  item={activeItem}
                  level={activeItem.depth}
                  opacity-80
                />
              ) : null}
            </DragOverlay>,
            document.body,
          )}
        </SortableContext>
      </DndContext>
    </Box>
  )

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId as string)

    document.body.style.setProperty('cursor', 'grabbing')
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    const activeId = active.id as string
    const overId = over?.id as string
    resetState()

    if (!over || activeId === overId) return

    // TODO: why
    const clonedItems = nodes.map((i) => i)

    const newTree = produce(clonedItems, (draft) => {
      const tree = new CatalogueTree(draft as any)
      const activeItem = tree.findNode(activeId)!
      const overItem = tree.findNode(overId)!

      const flattenedTree = tree.flatten()
      const activeFlattenIndex = flattenedTree.findIndex(
        (i) => i.id === activeId,
      )
      const overFlattenIndex = flattenedTree.findIndex((i) => i.id === overId)

      const activeFlattenItem = flattenedTree[activeFlattenIndex]
      const overFlattenItem = flattenedTree[overFlattenIndex]

      if (activeItem.isDoc && overItem.isDoc) {
        const activeParentNode = tree.findNode(
          activeFlattenItem?.parentId as string,
        )!

        // parentId is equal
        if (activeFlattenItem?.parentId === overFlattenItem?.parentId) {
          const parentList = activeParentNode
            ? activeParentNode.children!
            : draft

          const from = parentList.findIndex((i) => i.id === active.id)
          const to = parentList.findIndex((i) => i.id === over.id)
          arrayMove(parentList, from, to)

          return
        }

        // parentId not equal
        if (activeFlattenItem?.parentId !== overFlattenItem?.parentId) {
          const overParent = tree.findNode(overFlattenItem?.parentId as string)!
          const overList = overParent ? overParent.children! : draft

          const index = overList.findIndex((i) => i.id === over.id)
          const to = activeFlattenIndex < overFlattenIndex ? index + 1 : index

          overList.splice(to, 0, Object.create(activeItem))
          tree.deleteNode(activeItem)
        }

        return
      }

      if (activeItem.isDoc && overItem.isGroup) {
        overItem?.children?.unshift(Object.create(activeItem))
        tree.deleteNode(activeItem)
        return
      }

      if (activeItem.isGroup && overItem.isDoc) {
        // can't move to self children
        const find = activeItem.children?.find((i) => i.id === over.id)
        if (find) return

        const overParent = tree.findNode(overFlattenItem?.parentId as string)!
        const overList = overParent ? overParent.children! : draft
        const index = overList.findIndex((i) => i.id === over.id)
        const to = activeFlattenIndex < overFlattenIndex ? index + 1 : index

        overList.splice(to, 0, Object.create(activeItem))
        tree.deleteNode(activeItem)
        return
      }

      if (activeItem.isGroup && overItem.isGroup) {
        overItem?.children?.unshift(Object.create(activeItem))
        tree.deleteNode(activeItem)
        return
      }
    })

    catalogue.moveNode(newTree)
  }

  function handleDragCancel() {
    resetState()
  }

  function resetState() {
    setActiveId(null)
    document.body.style.setProperty('cursor', '')
  }
}

function arrayMove<T>(array: T[], fromIndex: number, toIndex: number): void {
  if (fromIndex === toIndex) {
    return
  }

  const element = array.splice(fromIndex, 1)[0]
  array.splice(toIndex, 0, element)
}
